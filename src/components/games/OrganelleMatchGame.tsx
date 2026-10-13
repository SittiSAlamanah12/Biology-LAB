import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Target, CheckCircle2, RotateCcw, Clock, Trophy, Sparkles } from 'lucide-react';

interface MatchItem {
  id: string;
  name: string;
  type: 'Organel Sel' | 'Organ Tubuh';
  clue: string;
  category: 'sel' | 'organ';
}

const MATCH_DATA: MatchItem[] = [
  { id: '1', name: 'Mitokondria', type: 'Organel Sel', clue: 'Penghasil energi ATP melalui Siklus Krebs & Fosforilasi Oksidatif', category: 'sel' },
  { id: '2', name: 'Badan Golgi', type: 'Organel Sel', clue: 'Memodifikasi, menyortir, dan mengemas glikoprotein ke vesikel sekresi', category: 'sel' },
  { id: '3', name: 'Lisosom', type: 'Organel Sel', clue: 'Kantung enzim hidrolitik untuk autofagi dan fagositosis patogen', category: 'sel' },
  { id: '4', name: 'Kloroplas', type: 'Organel Sel', clue: 'Mengandung klorofil untuk reaksi terang & Siklus Calvin fotosintesis', category: 'sel' },
  { id: '5', name: 'Retikulum Endoplasma Kasar', type: 'Organel Sel', clue: 'Jejaring membran bertabur ribosom tempat sintesis protein sekretori', category: 'sel' },
  { id: '6', name: 'Vakuola Sentral', type: 'Organel Sel', clue: 'Menyimpan getah sel dan memelihara tekanan turgor sel tumbuhan', category: 'sel' },
  { id: '7', name: 'Ventrikel Kiri', type: 'Organ Tubuh', clue: 'Ruang jantung berdinding miokardium paling tebal pemompa darah ke seluruh tubuh', category: 'organ' },
  { id: '8', name: 'Alveolus', type: 'Organ Tubuh', clue: 'Kantung mikroskopis tempat difusi O2 dan CO2 di paru-paru', category: 'organ' },
  { id: '9', name: 'Glomerulus', type: 'Organ Tubuh', clue: 'Anyaman kapiler di korteks ginjal tempat filtrasi darah menjadi urine primer', category: 'organ' },
  { id: '10', name: 'Nodus Ranvier', type: 'Organ Tubuh', clue: 'Celah akson tanpa mielin tempat lompatan impuls konduksi saltatori', category: 'organ' },
];

export const OrganelleMatchGame: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MatchItem | null>(null);
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<MatchItem[]>([]);
  const [shuffledClues, setShuffledClues] = useState<MatchItem[]>([]);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    restartGame();
  }, []);

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const restartGame = () => {
    sound.playClick();
    setMatchedIds([]);
    setScore(0);
    setSelectedItem(null);
    setSelectedClue(null);
    setTimer(0);
    setIsGameOver(false);

    // Shuffle 6 items for a quick, engaging round
    const sample = [...MATCH_DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
    setShuffledItems([...sample].sort(() => 0.5 - Math.random()));
    setShuffledClues([...sample].sort(() => 0.5 - Math.random()));
  };

  const handleItemClick = (item: MatchItem) => {
    if (matchedIds.includes(item.id)) return;
    sound.playClick();
    setSelectedItem(item);

    if (selectedClue) {
      checkMatch(item.id, selectedClue);
    }
  };

  const handleClueClick = (clueItemId: string) => {
    if (matchedIds.includes(clueItemId)) return;
    sound.playClick();
    setSelectedClue(clueItemId);

    if (selectedItem) {
      checkMatch(selectedItem.id, clueItemId);
    }
  };

  const checkMatch = (itemId: string, clueId: string) => {
    if (itemId === clueId) {
      sound.playSuccess();
      const newMatches = [...matchedIds, itemId];
      setMatchedIds(newMatches);
      setScore((s) => s + 150);
      setSelectedItem(null);
      setSelectedClue(null);

      if (newMatches.length === shuffledItems.length) {
        setIsGameOver(true);
        confetti({ particleCount: 100, spread: 70 });
      }
    } else {
      sound.playError();
      setSelectedItem(null);
      setSelectedClue(null);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Game Edukasi Anatomi & Sitologi · Kelas 11 SMA
          </span>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            BioMatch: Pasangkan Struktur & Fungsi
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pilih nama organ/organel di kolom kiri, lalu pasangkan dengan deskripsi fungsi biologis yang tepat di kolom kanan.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold">{timer}s</span>
          </div>
          <div className="w-px h-5 bg-slate-800" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-emerald-400">{score}</span>
          </div>
          <button
            onClick={restartGame}
            title="Ulangi Game"
            className="p-1 text-slate-400 hover:text-slate-100 transition ml-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matching Columns */}
      {!isGameOver ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Names */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              STRUKTUR BIOLOGI (KLIK SATU)
            </span>
            {shuffledItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between text-xs ${
                    isMatched
                      ? 'bg-slate-950/40 border-slate-800/40 text-slate-600 line-through'
                      : isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Clues */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              FUNGSI & PERAN UTAMA (KLIK PASANGANNYA)
            </span>
            {shuffledClues.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedClue === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleClueClick(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-2.5 text-xs ${
                    isMatched
                      ? 'bg-slate-950/40 border-slate-800/40 text-slate-600 line-through'
                      : isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 ring-2 ring-cyan-500/20'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.clue}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="py-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-100">Luar Biasa, Pemahaman Sempurna!</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Semua pasangan organel dan organ berhasil dihubungkan dengan benar dalam waktu{' '}
            <strong className="text-emerald-400 font-mono">{timer} detik</strong>.
          </p>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{score} Poin</div>
          <button
            onClick={restartGame}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 mx-auto transition"
          >
            <RotateCcw className="w-4 h-4" />
            Mainkan Ronde Baru
          </button>
        </div>
      )}
    </div>
  );
};
