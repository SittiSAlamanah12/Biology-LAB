/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ThreeViewer } from './components/ThreeViewer';
import { BIOLOGY_MODELS } from './data/biologyData';
import { BioModelInfo, HotspotPart } from './types/biology';
import { sound } from './utils/audio';

// Educational Games
import { ProteinSynthesisGame } from './components/games/ProteinSynthesisGame';
import { BloodTypingGame } from './components/games/BloodTypingGame';
import { OrganelleMatchGame } from './components/games/OrganelleMatchGame';
import { FoodWebGame } from './components/games/FoodWebGame';

// Quiz & Atlas
import { QuizSection } from './components/QuizSection';
import { MateriAtlas } from './components/MateriAtlas';

import {
  Dna,
  Heart,
  Brain,
  Wind,
  ShieldAlert,
  Flame,
  Gamepad2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('models');
  const [isMuted, setIsMuted] = useState(false);

  // 3D Model Explorer State
  const [selectedModel, setSelectedModel] = useState<BioModelInfo>(BIOLOGY_MODELS[0]);
  const [selectedPart, setSelectedPart] = useState<HotspotPart | null>(null);
  const [modelCategoryFilter, setModelCategoryFilter] = useState<'all' | 'organ' | 'sel'>('all');

  // Active Game State
  const [activeGameId, setActiveGameId] = useState<'protein' | 'blood' | 'match' | 'foodweb'>('protein');

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const filteredModels = BIOLOGY_MODELS.filter((m) =>
    modelCategoryFilter === 'all' ? true : m.category === modelCategoryFilter
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ======================= TAB 1: 3D ORGAN & SEL ======================= */}
        {currentTab === 'models' && (
          <div className="space-y-8">
            {/* Hero Banner with Quick Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  <GraduationCap className="w-4 h-4" />
                  Eksplorasi Anatomi & Sitologi 3D Real-Time
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
                  Visualisasi 3D Organ & Sel Biologi SMA
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Putar 360°, perbesar, dan pelajari organ tubuh manusia serta organel sel secara spasial. Dilengkapi simulasi denyut fisiologis dan transmisi potensial aksi saraf.
                </p>
              </div>

              {/* Category Segmented Filter */}
              <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => {
                    sound.playClick();
                    setModelCategoryFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    modelCategoryFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Semua ({BIOLOGY_MODELS.length})
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setModelCategoryFilter('organ');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    modelCategoryFilter === 'organ'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Organ Tubuh (4)
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setModelCategoryFilter('sel');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    modelCategoryFilter === 'sel'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Biologi Seluler (4)
                </button>
              </div>
            </div>

            {/* Model Selection Horizontal Ribbon */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {filteredModels.map((item) => {
                const isSelected = selectedModel.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedModel(item);
                      setSelectedPart(null);
                    }}
                    className={`px-4 py-3 rounded-xl border text-left shrink-0 transition flex flex-col min-w-[200px] ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="uppercase tracking-wider font-semibold text-[10px] text-emerald-400">
                        {item.category === 'organ' ? 'Organ' : 'Sel'}
                      </span>
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                        Kelas {item.grade}
                      </span>
                    </div>
                    <span className="font-bold text-slate-100 text-sm">{item.name}</span>
                    <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.curriculumTopic}</span>
                  </button>
                );
              })}
            </div>

            {/* 3D Interactive Canvas Viewer */}
            <ThreeViewer
              model={selectedModel}
              selectedPart={selectedPart}
              onSelectPart={setSelectedPart}
            />

            {/* Quick Curriculum Highlights Below 3D Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-emerald-400">Capaian Pembelajaran (CP)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Memahami keterkaitan antara struktur jaringan penyusun organ dengan fungsinya dalam sistem regulasi dan homeostasis tubuh.
                </p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-cyan-400">Dimensi Spasial & Mikroskopik</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menjembatani pemahaman dari makroskopis organ hingga organel membran sub-seluler beresolusi tinggi.
                </p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-amber-400">Penalaran Saintifik SMA</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menganalisis keterkaitan kegagalan fungsi organel atau jaringan terhadap manifestasi kelainan patologis/penyakit.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: GAME EDUKASI ======================= */}
        {currentTab === 'games' && (
          <div className="space-y-6">
            {/* Game Hub Navigation Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  <Gamepad2 className="w-4 h-4" />
                  Laboratorium Gamifikasi Biologi
                </div>
                <h2 className="text-2xl font-bold text-slate-50">
                  Game Edukasi Biologi Interaktif
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Belajar konsep biologi SMA melalui game simulasi langsung, lab virtual, dan tantangan logika!
                </p>
              </div>

              {/* Game Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveGameId('protein');
                  }}
                  className={`px-3 py-2 rounded-lg font-medium transition text-center ${
                    activeGameId === 'protein'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sintesis Protein
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveGameId('blood');
                  }}
                  className={`px-3 py-2 rounded-lg font-medium transition text-center ${
                    activeGameId === 'blood'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Uji Golongan Darah
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveGameId('match');
                  }}
                  className={`px-3 py-2 rounded-lg font-medium transition text-center ${
                    activeGameId === 'match'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BioMatch Organel
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveGameId('foodweb');
                  }}
                  className={`px-3 py-2 rounded-lg font-medium transition text-center ${
                    activeGameId === 'foodweb'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Food Web Balancer
                </button>
              </div>
            </div>

            {/* Active Game Component */}
            {activeGameId === 'protein' && <ProteinSynthesisGame />}
            {activeGameId === 'blood' && <BloodTypingGame />}
            {activeGameId === 'match' && <OrganelleMatchGame />}
            {activeGameId === 'foodweb' && <FoodWebGame />}
          </div>
        )}

        {/* ======================= TAB 3: KUIS PEMAHAMAN ======================= */}
        {currentTab === 'quiz' && <QuizSection />}

        {/* ======================= TAB 4: MATERI & GLOSARIUM ======================= */}
        {currentTab === 'atlas' && <MateriAtlas />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">BioLab 3D SMA</span>
            <span>·</span>
            <span>Kurikulum Merdeka & K13 Biologi Indonesia</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Didesain khusus untuk pembelajaran interaktif siswa SMA Kelas 10, 11, dan 12.
          </p>
        </div>
      </footer>
    </div>
  );
}
