import React from 'react';
import { sound } from '../utils/audio';
import {
  Dna,
  Gamepad2,
  HelpCircle,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'models' | 'games' | 'quiz' | 'atlas';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isMuted,
  onToggleMute,
}) => {
  const navItems = [
    {
      id: 'models' as NavTab,
      label: '3D Organ & Sel',
      icon: Dna,
      badge: '8 Model 3D',
    },
    {
      id: 'games' as NavTab,
      label: 'Game Edukasi',
      icon: Gamepad2,
      badge: '4 Game Lab',
    },
    {
      id: 'quiz' as NavTab,
      label: 'Kuis Pemahaman',
      icon: HelpCircle,
      badge: 'HOTS & UTBK',
    },
    {
      id: 'atlas' as NavTab,
      label: 'Materi & Glosarium',
      icon: BookOpen,
      badge: 'Atlas',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            sound.playClick();
            onSelectTab('models');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition">
            <Dna className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-100 text-base tracking-tight">
                BioLab<span className="text-emerald-400">3D</span>
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.2 rounded font-semibold">
                SMA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
              Media Belajar & Game Biologi Interaktif
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Zero-Pill Typography & Clean Segmented Buttons) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(item.id);
                }}
                className={`px-3.5 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Audio & Quick Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            title={isMuted ? 'Nyalakan Efek Suara' : 'Bisukan Efek Suara'}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer Row */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800/60 py-2 px-2 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(item.id);
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
