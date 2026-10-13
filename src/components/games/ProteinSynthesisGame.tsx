import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Play, RotateCcw, Award, CheckCircle, AlertCircle, HelpCircle, Flame } from 'lucide-react';

interface CodonTask {
  codon: string;
  anticodon: string;
  aminoAcid: string;
  fullName: string;
  isStart?: boolean;
  isStop?: boolean;
}

const CODON_DATABASE: CodonTask[] = [
  { codon: 'AUG', anticodon: 'UAC', aminoAcid: 'Met', fullName: 'Metionin (Start Codon)', isStart: true },
  { codon: 'UUU', anticodon: 'AAA', aminoAcid: 'Phe', fullName: 'Fenilalanin' },
  { codon: 'GGC', anticodon: 'CCG', aminoAcid: 'Gly', fullName: 'Glisin' },
  { codon: 'UAC', anticodon: 'AUG', aminoAcid: 'Tyr', fullName: 'Tirosin' },
  { codon: 'GAG', anticodon: 'CUC', aminoAcid: 'Glu', fullName: 'Asam Glutamat' },
  { codon: 'CAC', anticodon: 'GUG', aminoAcid: 'His', fullName: 'Histidin' },
  { codon: 'CUG', anticodon: 'GAC', aminoAcid: 'Leu', fullName: 'Leusin' },
  { codon: 'AAG', anticodon: 'UUC', aminoAcid: 'Lys', fullName: 'Lisin' },
  { codon: 'UGU', anticodon: 'ACA', aminoAcid: 'Cys', fullName: 'Sistein' },
  { codon: 'UAA', anticodon: 'AUU', aminoAcid: 'STOP', fullName: 'Stop Kodon (Terminasi)', isStop: true },
];

export const ProteinSynthesisGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<CodonTask[]>([]);
  const [assembledChain, setAssembledChain] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize round
  const startNewGame = () => {
    sound.playClick();
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setCurrentIndex(0);
    setAssembledChain([]);
    setFeedback(null);
    setupQuestion(0);
  };

  const setupQuestion = (index: number) => {
    const target = CODON_DATABASE[index % CODON_DATABASE.length];

    // Pick 3 random distractors
    const distractors = CODON_DATABASE.filter((c) => c.codon !== target.codon)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const shuffled = [target, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
  };

  // Timer tick
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('completed');
      sound.playSuccess();
      confetti({ particleCount: 80, spread: 60 });
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Handle player selecting a tRNA molecule
  const handleSelectTRNA = (selected: CodonTask) => {
    const currentTarget = CODON_DATABASE[currentIndex % CODON_DATABASE.length];

    if (selected.codon === currentTarget.codon) {
      // Correct match!
      sound.playSuccess();
      const newStreak = streak + 1;
      const points = 100 + newStreak * 20;
      setScore((prev) => prev + points);
      setStreak(newStreak);
      setAssembledChain((prev) => [...prev, selected.aminoAcid]);
      setFeedback({
        message: `Tepat! Antikodon ${selected.anticodon} berpasangan dengan kodon ${selected.codon} menghasilkan ${selected.fullName}`,
        type: 'success',
      });

      // Advance
      const nextIdx = currentIndex + 1;
      if (nextIdx >= CODON_DATABASE.length) {
        setGameState('completed');
        confetti({ particleCount: 120, spread: 80 });
      } else {
        setCurrentIndex(nextIdx);
        setupQuestion(nextIdx);
      }
    } else {
      // Wrong match
      sound.playError();
      setStreak(0);
      setFeedback({
        message: `Kurang tepat! Antikodon ${selected.anticodon} tidak cocok dengan kodon ${currentTarget.codon}. Ingat aturan komplemen: A-U dan G-C!`,
        type: 'error',
      });
    }
  };

  const currentTarget = CODON_DATABASE[currentIndex % CODON_DATABASE.length];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
      {/* Game Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Game Sintesis Protein · Kelas 12 SMA
          </span>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Ribosom Translation Rush
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Bantu Ribosom merakit rantai polipeptida! Cocokkan kodon mRNA dengan molekul tRNA & asam amino komplemen.
          </p>
        </div>

        {/* Game Stats */}
        {gameState === 'playing' && (
          <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
            <div className="text-center">
              <span className="text-slate-400 block text-[10px]">WAKTU</span>
              <span className={`font-mono font-bold text-base ${timeLeft < 15 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center">
              <span className="text-slate-400 block text-[10px]">SKOR</span>
              <span className="font-mono font-bold text-base text-emerald-400">{score}</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center">
              <span className="text-slate-400 block text-[10px]">COMBO</span>
              <span className="font-mono font-bold text-base text-amber-400 flex items-center justify-center gap-0.5">
                <Flame className="w-3.5 h-3.5" />
                {streak}x
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Screen */}
      {gameState === 'idle' && (
        <div className="py-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Siap Menjadi Ribosom Sel?</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dalam sel tubuh, Ribosom membaca pita kodon mRNA (triplet basa nitrogen) satu per satu. Pasangkan dengan molekul tRNA yang membawa antikodon komplemen:
            <br />
            <strong className="text-emerald-400">A berpasangan dengan U</strong> dan <strong className="text-emerald-400">G berpasangan dengan C</strong>.
          </p>
          <button
            onClick={startNewGame}
            className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 mx-auto transition"
          >
            <Play className="w-4 h-4" />
            Mulai Permainan (60 Detik)
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="mt-6 space-y-6">
          {/* mRNA Ribbon Track Display */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
              PITA mRNA 5' ➔ 3' DI CELAH RIBOSOM
            </span>
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              <span className="text-xs font-mono text-slate-500">5'—</span>
              {CODON_DATABASE.map((task, idx) => {
                const isCurrent = idx === currentIndex;
                const isPast = idx < currentIndex;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-lg font-mono text-center shrink-0 border transition ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30 scale-105'
                        : isPast
                        ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-sm font-bold tracking-widest block">{task.codon}</span>
                    <span className="text-[9px] block text-slate-400 mt-0.5">{task.aminoAcid}</span>
                  </div>
                );
              })}
              <span className="text-xs font-mono text-slate-500">—3'</span>
            </div>
          </div>

          {/* Current Active Target Card */}
          <div className="text-center p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl">
            <span className="text-xs text-slate-400">Target Kodon Saat Ini:</span>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-widest font-mono mt-1">
              {currentTarget.codon}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Manakah molekul tRNA dengan <strong>Antikodon</strong> komplemen yang membawa asam amino ini?
            </p>
          </div>

          {/* tRNA Options Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectTRNA(opt)}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/70 hover:bg-emerald-950/20 text-left transition transform hover:-translate-y-1 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono text-[10px]">tRNA #{i + 1}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">
                      {opt.aminoAcid}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{opt.fullName}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Antikodon:</span>
                  <span className="font-mono font-bold text-sm text-cyan-300">{opt.anticodon}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback message banner */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Assembled Polypeptide Chain Display */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
              RANTAI POLIPEPTIDA YANG TELAH TERBENTUK (PROTEIN):
            </span>
            {assembledChain.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Belum ada asam amino yang terangkai...</span>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-mono text-emerald-400 font-semibold">N-terminus</span>
                {assembledChain.map((aa, i) => (
                  <React.Fragment key={i}>
                    <span className="text-slate-500 text-xs">➔</span>
                    <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 text-xs px-2.5 py-1 rounded-md font-mono font-bold">
                      {aa}
                    </span>
                  </React.Fragment>
                ))}
                <span className="text-slate-500 text-xs">➔</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">C-terminus</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed State */}
      {gameState === 'completed' && (
        <div className="py-8 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/40">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-100">Translasi Selesai!</h4>
          <p className="text-xs text-slate-300">
            Hebat! Kamu berhasil mensintesis protein fungsional dengan skor akhir:
          </p>
          <div className="text-4xl font-extrabold text-emerald-400 font-mono my-2">{score} Poin</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rantai polipeptida ini selanjutnya akan masuk ke Retikulum Endoplasma dan Badan Golgi untuk pelipatan (protein folding) menjadi struktur tersier yang aktif secara biokimiawi.
          </p>
          <button
            onClick={startNewGame}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 mx-auto transition"
          >
            <RotateCcw className="w-4 h-4" />
            Mainkan Lagi
          </button>
        </div>
      )}
    </div>
  );
};
