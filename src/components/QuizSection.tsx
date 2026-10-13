import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types/biology';
import { sound } from '../utils/audio';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Award,
  ChevronRight,
  BookOpen,
  Filter,
  Download,
  Share2
} from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | '10' | '11' | '12'>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<
    { questionId: string; selected: number; correct: number; isCorrect: boolean }[]
  >([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [studentName, setStudentName] = useState('Siswa SMA Biologi');

  // Filter questions by grade
  const handleFilterGrade = (grade: 'all' | '10' | '11' | '12') => {
    sound.playClick();
    setSelectedGrade(grade);
    const filtered =
      grade === 'all'
        ? QUIZ_QUESTIONS
        : QUIZ_QUESTIONS.filter((q) => q.grade === grade);
    setQuestions(filtered);
    resetQuiz(filtered);
  };

  const resetQuiz = (qs: QuizQuestion[] = questions) => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnswersHistory([]);
    setIsQuizFinished(false);
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswerIndex;
    if (isCorrect) {
      sound.playSuccess();
      setScore((s) => s + 1);
    } else {
      sound.playError();
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: selectedOption,
        correct: currentQ.correctAnswerIndex,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizFinished(true);
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Evaluasi Pemahaman Konsep · Kurikulum SMA
          </span>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            Kuis Interaktif Biologi SMA & UTBK
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Uji pemahaman konsep biologi dengan soal penalaran ilmiah (HOTS) disertai pembahasan lengkap.
          </p>
        </div>

        {/* Grade Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
          {[
            { id: 'all', label: 'Semua Materi' },
            { id: '10', label: 'Kelas 10' },
            { id: '11', label: 'Kelas 11' },
            { id: '12', label: 'Kelas 12 / UTBK' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterGrade(tab.id as 'all' | '10' | '11' | '12')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedGrade === tab.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {!isQuizFinished ? (
        <div className="mt-6 space-y-6">
          {/* Progress bar and counter */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Soal <strong className="text-emerald-400">{currentIndex + 1}</strong> dari{' '}
              {questions.length}
            </span>
            <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-[11px]">
              Tingkat: <strong className="text-amber-400">{currentQ.difficulty}</strong>
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                Kelas {currentQ.grade} SMA
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Topik: {currentQ.topic}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-slate-100 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let btnStyle =
                'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    'bg-rose-950/50 border-rose-500 text-rose-200 ring-2 ring-rose-500/20';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600';
                }
              } else if (isSelected) {
                btnStyle =
                  'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 ring-2 ring-emerald-500/30';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between text-xs md:text-sm ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {isAnswerSubmitted && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <BookOpen className="w-4 h-4" />
                Pembahasan Konsep Ilmiah:
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className={`px-6 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition ${
                  selectedOption !== null
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Kunci Jawaban
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                {currentIndex + 1 < questions.length ? (
                  <>
                    Soal Berikutnya
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Lihat Hasil Akhir & Sertifikat
                    <Award className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished & Certificate Screen */
        <div className="mt-6 space-y-8">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Kuis Selesai!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Hasil evaluasi penguasaan materi biologi kamu:
            </p>
            <div className="text-5xl font-black text-emerald-400 font-mono my-4">
              {scorePercentage}%
            </div>
            <p className="text-xs text-slate-300">
              Benar <strong className="text-emerald-400">{score}</strong> dari{' '}
              <strong>{questions.length}</strong> pertanyaan.
            </p>
          </div>

          {/* Student Certificate Card */}
          <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl shadow-2xl relative overflow-hidden text-center space-y-3">
            <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
              BIOLAB 3D SMA · SERTIFIKAT PRESTASI BELAJAR
            </div>
            <h4 className="text-xl font-bold text-slate-100">
              Sertifikat Penguasaan Konsep Biologi
            </h4>
            <div className="py-2">
              <label className="text-[11px] text-slate-400 block mb-1">Diberikan kepada:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ketik nama kamu di sini..."
                className="bg-slate-900 text-center font-bold text-emerald-300 text-sm md:text-base border border-slate-700 rounded-lg px-4 py-1.5 w-full max-w-sm mx-auto focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Telah berhasil menyelesaikan simulasi kuis biologi interaktif dengan nilai{' '}
              <strong className="text-emerald-400">{scorePercentage}</strong> pada modul Kurikulum Merdeka Biologi SMA.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 font-mono">
              Verifikasi ID: BIO-SMA-{Math.random().toString(36).substring(2, 9).toUpperCase()}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => resetQuiz()}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi Kuis
            </button>
            <button
              onClick={() => alert(`Sertifikat tersimpan untuk ${studentName}! Selamat atas pencapaian belajarmu.`)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Simpan Sertifikat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
