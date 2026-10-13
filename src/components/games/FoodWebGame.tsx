import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Trees, AlertTriangle, ShieldCheck, RotateCcw, Activity } from 'lucide-react';

interface TrophicLevel {
  id: string;
  name: string;
  role: string;
  example: string;
  population: number; // 0 to 100
  targetMin: number;
  targetMax: number;
  color: string;
}

export const FoodWebGame: React.FC = () => {
  const [trophicLevels, setTrophicLevels] = useState<TrophicLevel[]>([
    {
      id: 'produsen',
      name: 'Produsen Primer',
      role: 'Tumbuhan Hijau / Fitoplankton',
      example: 'Padi, Rumput & Alga Hijau',
      population: 80,
      targetMin: 60,
      targetMax: 95,
      color: '#22c55e',
    },
    {
      id: 'konsumen1',
      name: 'Konsumen Primer (Herbivora)',
      role: 'Pemakan Tumbuhan Tingkat I',
      example: 'Belalang, Ulat & Tikus',
      population: 65,
      targetMin: 45,
      targetMax: 75,
      color: '#eab308',
    },
    {
      id: 'konsumen2',
      name: 'Konsumen Sekunder (Karnivora Kecil)',
      role: 'Pemangsa Herbivora Tingkat II',
      example: 'Katak & Burung Pemakan Serangga',
      population: 45,
      targetMin: 30,
      targetMax: 60,
      color: '#f97316',
    },
    {
      id: 'konsumen3',
      name: 'Konsumen Tersier (Puncak)',
      role: 'Predator Puncak (Apex)',
      example: 'Ular Sawah & Elang Jawa',
      population: 25,
      targetMin: 15,
      targetMax: 40,
      color: '#ef4444',
    },
    {
      id: 'dekomposer',
      name: 'Pengurai (Dekomposer)',
      role: 'Daur Ulang Nutrisi Organik',
      example: 'Bakteri Tanah & Jamur Saprofit',
      population: 70,
      targetMin: 50,
      targetMax: 85,
      color: '#a855f7',
    },
  ]);

  const [activeDisruption, setActiveDisruption] = useState<string | null>(null);
  const [simulationLog, setSimulationLog] = useState<string>(
    'Ekosistem berada dalam kesetimbangan dinamis (homeostasis). Uji ketahanan dengan memicu peristiwa lingkungan di bawah.'
  );

  const handlePopulationChange = (id: string, delta: number) => {
    sound.playClick();
    setTrophicLevels((prev) =>
      prev.map((level) => {
        if (level.id === id) {
          const newPop = Math.max(5, Math.min(100, level.population + delta));
          return { ...level, population: newPop };
        }
        return level;
      })
    );
  };

  const triggerDisruption = (
    type: 'pestisida' | 'perburuan' | 'deforestasi' | 'penghijauan'
  ) => {
    sound.playClick();
    setActiveDisruption(type);

    if (type === 'pestisida') {
      sound.playError();
      setTrophicLevels((prev) =>
        prev.map((t) => {
          if (t.id === 'konsumen1') return { ...t, population: 15 };
          if (t.id === 'konsumen2') return { ...t, population: 20 };
          if (t.id === 'produsen') return { ...t, population: 98 };
          return t;
        })
      );
      setSimulationLog(
        'Penyemprotan pestisida kimia massal melenyapkan herbivora dan serangga! Konsumen sekunder (katak & burung) kelaparan, sementara populasi rumput melonjak drastis.'
      );
    } else if (type === 'perburuan') {
      sound.playError();
      setTrophicLevels((prev) =>
        prev.map((t) => {
          if (t.id === 'konsumen3') return { ...t, population: 5 };
          if (t.id === 'konsumen2') return { ...t, population: 85 };
          if (t.id === 'konsumen1') return { ...t, population: 20 };
          return t;
        })
      );
      setSimulationLog(
        'Perburuan elang dan ular liar menghilangkan predator puncak (apex)! Akibatnya populasi katak/tikus meledak tak terkendali dan merusak rantai trofik.'
      );
    } else if (type === 'deforestasi') {
      sound.playError();
      setTrophicLevels((prev) =>
        prev.map((t) => {
          if (t.id === 'produsen') return { ...t, population: 20 };
          if (t.id === 'konsumen1') return { ...t, population: 25 };
          if (t.id === 'konsumen2') return { ...t, population: 15 };
          if (t.id === 'konsumen3') return { ...t, population: 10 };
          return t;
        })
      );
      setSimulationLog(
        'Penebangan liar merusak biomassa produsen! Seluruh tingkat trofik di atasnya mengalami keruntuhan piramida energi bertingkat.'
      );
    } else if (type === 'penghijauan') {
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 60 });
      setTrophicLevels([
        { ...trophicLevels[0], population: 80 },
        { ...trophicLevels[1], population: 65 },
        { ...trophicLevels[2], population: 45 },
        { ...trophicLevels[3], population: 25 },
        { ...trophicLevels[4], population: 70 },
      ]);
      setSimulationLog(
        'Konservasi ekologis dan reboisasi berhasil memulihkan daya dukung lingkungan (carrying capacity) dan memulihkan kesetimbangan ekosistem!'
      );
    }
  };

  const isBalanced = trophicLevels.every(
    (t) => t.population >= t.targetMin && t.population <= t.targetMax
  );

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Simulasi Ekologi & Jaring Makanan · Kelas 10 SMA
          </span>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-400" />
            Food Web Balancer: Simulasi Keseimbangan Ekosistem
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pantau piramida biomassa trofik dan amati efek kaskade trofik saat ekosistem mengalami gangguan lingkungan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBalanced ? (
            <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Ekosistem Seimbang (Homeostasis)
            </span>
          ) : (
            <span className="bg-rose-950/60 text-rose-300 border border-rose-500/40 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Ekosistem Terganggu
            </span>
          )}
        </div>
      </div>

      {/* Simulation Log banner */}
      <div className="mt-5 p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs">
        <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">{simulationLog}</p>
      </div>

      {/* Trophic Levels Biomass Stack */}
      <div className="mt-6 space-y-4">
        {trophicLevels.map((level) => {
          const inRange =
            level.population >= level.targetMin &&
            level.population <= level.targetMax;
          return (
            <div
              key={level.id}
              className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="font-bold text-slate-100 text-sm">{level.name}</span>
                  <span className="text-slate-400 text-xs ml-2">({level.role})</span>
                  <p className="text-[11px] text-slate-500">Contoh: {level.example}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold text-xs ${
                      inRange ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    Biomassa: {level.population}%
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePopulationChange(level.id, -10)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono font-bold flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handlePopulationChange(level.id, 10)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono font-bold flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Biomass Bar */}
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${level.population}%`,
                    backgroundColor: level.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Ecological Disruptions Triggers */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <span className="text-xs font-semibold text-slate-300 block mb-3">
          PICU SIMULASI PERISTIWA LINGKUNGAN:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => triggerDisruption('pestisida')}
            className="p-3 bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-700/60 rounded-xl text-left text-xs transition"
          >
            <strong className="text-rose-300 block">Pestisida Kimia</strong>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Racun serangga massal</span>
          </button>

          <button
            onClick={() => triggerDisruption('perburuan')}
            className="p-3 bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-700/60 rounded-xl text-left text-xs transition"
          >
            <strong className="text-amber-300 block">Perburuan Liar</strong>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Hilangnya predator puncak</span>
          </button>

          <button
            onClick={() => triggerDisruption('deforestasi')}
            className="p-3 bg-slate-950 hover:bg-orange-950/40 border border-slate-800 hover:border-orange-700/60 rounded-xl text-left text-xs transition"
          >
            <strong className="text-orange-300 block">Deforestasi Hutan</strong>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Kerusakan produsen</span>
          </button>

          <button
            onClick={() => triggerDisruption('penghijauan')}
            className="p-3 bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-700/60 rounded-xl text-left text-xs transition"
          >
            <strong className="text-emerald-300 block">Reboisasi & Konservasi</strong>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Pulihkan ekosistem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
