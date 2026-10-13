import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Pipette, CheckCircle, AlertTriangle, RotateCcw, HeartPulse, User } from 'lucide-react';

interface PatientCase {
  id: string;
  patientName: string;
  age: number;
  condition: string;
  actualType: string;
  // Reactions: true = agglutinates (clumps), false = no agglutination (smooth)
  antiA: boolean;
  antiB: boolean;
  antiRh: boolean;
  compatibleDonors: string[];
  explanation: string;
}

const PATIENT_CASES: PatientCase[] = [
  {
    id: 'p1',
    patientName: 'Rian Pratama',
    age: 17,
    condition: 'Anemia berat pasca-kecelakaan, Hb 6.5 g/dL. Butuh 2 kantong darah segera.',
    actualType: 'A+',
    antiA: true,
    antiB: false,
    antiRh: true,
    compatibleDonors: ['A+', 'A-', 'O+', 'O-'],
    explanation: 'Darah menggumpal pada Anti-A (ada antigen A) dan Anti-Rh (ada antigen D), tetapi tidak menggumpal pada Anti-B (tidak ada antigen B). Maka golongan darah adalah A Rh+. Donor yang kompatibel: A+, A-, O+, O-.',
  },
  {
    id: 'p2',
    patientName: 'Siti Rahmawati',
    age: 16,
    condition: 'Pendarahan gastrointestinal akut, membutuhkan transfusi PRC (Packed Red Cells).',
    actualType: 'B-',
    antiA: false,
    antiB: true,
    antiRh: false,
    compatibleDonors: ['B-', 'O-'],
    explanation: 'Darah hanya menggumpal pada Anti-B dan tidak menggumpal pada Anti-Rh. Maka golongan darah pasien adalah B Rh-. Karena Rhesus negatif, pasien HANYA boleh menerima donor Rh- (B- atau O-) agar tidak terbentuk antibodi anti-D fatal.',
  },
  {
    id: 'p3',
    patientName: 'Budi Santoso',
    age: 18,
    condition: 'Pasien bedah darurat fraktur femur terbuka, kehilangan 800 mL darah.',
    actualType: 'AB+',
    antiA: true,
    antiB: true,
    antiRh: true,
    compatibleDonors: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    explanation: 'Darah menggumpal pada Anti-A, Anti-B, dan Anti-Rh. Maka pasien bergolongan darah AB Rh+ (Resipien Universal). Pasien ini secara fisiologis dapat menerima darah dari semua golongan darah (A, B, AB, O baik positif maupun negatif)!',
  },
  {
    id: 'p4',
    patientName: 'Dewi Lestari',
    age: 17,
    condition: 'Demam berdarah dengue derajat III dengan perdarahan masif.',
    actualType: 'O-',
    antiA: false,
    antiB: false,
    antiRh: false,
    compatibleDonors: ['O-'],
    explanation: 'Darah tidak menggumpal pada Anti-A, Anti-B, maupun Anti-Rh (tidak memiliki antigen A, B, maupun D pada membran eritrositnya). Pasien adalah O Rh- (Donor Universal, tetapi sebagai resipien HANYA dapat menerima O Rh-).',
  },
];

export const BloodTypingGame: React.FC = () => {
  const [caseIndex, setCaseIndex] = useState(0);
  const [testedSera, setTestedSera] = useState<{ antiA: boolean; antiB: boolean; antiRh: boolean }>({
    antiA: false,
    antiB: false,
    antiRh: false,
  });
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [completedCases, setCompletedCases] = useState<number[]>([]);

  const currentPatient = PATIENT_CASES[caseIndex];

  const handleApplySerum = (serum: 'antiA' | 'antiB' | 'antiRh') => {
    sound.playClick();
    setTestedSera((prev) => ({ ...prev, [serum]: true }));
  };

  const handleCheckDiagnosis = () => {
    if (!selectedType || !selectedDonor) {
      alert('Pilih diagnosis golongan darah pasien dan pilih kantong donor yang aman terlebih dahulu.');
      return;
    }

    const isTypeCorrect = selectedType === currentPatient.actualType;
    const isDonorCorrect = currentPatient.compatibleDonors.includes(selectedDonor);

    if (isTypeCorrect && isDonorCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 90, spread: 70 });
      setResultMessage({
        success: true,
        text: `Diagnosis & Transfusi Sempurna! Pasien selamat. ${currentPatient.explanation}`,
      });
      if (!completedCases.includes(caseIndex)) {
        setCompletedCases((prev) => [...prev, caseIndex]);
      }
    } else {
      sound.playError();
      setResultMessage({
        success: false,
        text: !isTypeCorrect
          ? `Diagnosis golongan darah kurang tepat. Perhatikan sumur yang mengalami aglutinasi!`
          : `Donor ${selectedDonor} berbahaya bagi pasien ${selectedType}! Transfusi ini dapat memicu reaksi hemolitik akut.`,
      });
    }
  };

  const handleNextPatient = () => {
    sound.playClick();
    const nextIdx = (caseIndex + 1) % PATIENT_CASES.length;
    setCaseIndex(nextIdx);
    setTestedSera({ antiA: false, antiB: false, antiRh: false });
    setSelectedType(null);
    setSelectedDonor(null);
    setResultMessage(null);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Simulasi Virtual Lab · Biologi Kelas 11 SMA
          </span>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            Uji Golongan Darah & Transfusi IGD
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Uji aglutinasi eritrosit dengan serum Anti-A, Anti-B, & Anti-Rh untuk menentukan donor darah yang tepat.
          </p>
        </div>

        {/* Patient Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {PATIENT_CASES.map((patient, idx) => (
            <button
              key={patient.id}
              onClick={() => {
                sound.playClick();
                setCaseIndex(idx);
                setTestedSera({ antiA: false, antiB: false, antiRh: false });
                setSelectedType(null);
                setSelectedDonor(null);
                setResultMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                caseIndex === idx
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Pasien {idx + 1}</span>
              {completedCases.includes(idx) && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="mt-5 p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-100 text-sm">{currentPatient.patientName}</h4>
              <span className="text-[11px] text-slate-400">({currentPatient.age} Tahun)</span>
            </div>
            <p className="text-xs text-rose-300/90 mt-0.5">{currentPatient.condition}</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          Status: <strong className="text-amber-400 font-mono">Menunggu Transfusi</strong>
        </div>
      </div>

      {/* Virtual Glass Slide with 3 Testing Wells */}
      <div className="mt-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            KACA OBJEK LABORATORIUM (SLIDE TEST AGLUTINASI)
          </span>
          <span className="text-[11px] text-slate-400">Klik pipet reagen untuk meneteskan serum</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Well 1: Serum Anti-A */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center">
            <span className="text-xs font-semibold text-cyan-400 mb-2">Serum Anti-A (Biru)</span>
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center relative overflow-hidden bg-slate-950">
              {testedSera.antiA ? (
                currentPatient.antiA ? (
                  // Agglutination clumps visual
                  <div className="w-full h-full flex flex-wrap p-2 items-center justify-center gap-1 bg-red-950/40">
                    {[...Array(12)].map((_, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-rose-700 shadow-sm animate-pulse"
                      />
                    ))}
                    <span className="absolute bottom-1 text-[9px] font-mono font-bold text-rose-300 bg-slate-950/80 px-1 rounded">
                      AGLUTINASI (+)
                    </span>
                  </div>
                ) : (
                  // Smooth fluid
                  <div className="w-full h-full bg-red-600/40 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                      HOMOGEN (-)
                    </span>
                  </div>
                )
              ) : (
                <span className="text-[11px] text-slate-600">Belum diuji</span>
              )}
            </div>
            <button
              onClick={() => handleApplySerum('antiA')}
              disabled={testedSera.antiA}
              className={`mt-3 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                testedSera.antiA
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
              }`}
            >
              <Pipette className="w-3.5 h-3.5" />
              Teteskan Anti-A
            </button>
          </div>

          {/* Well 2: Serum Anti-B */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center">
            <span className="text-xs font-semibold text-amber-400 mb-2">Serum Anti-B (Kuning)</span>
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center relative overflow-hidden bg-slate-950">
              {testedSera.antiB ? (
                currentPatient.antiB ? (
                  <div className="w-full h-full flex flex-wrap p-2 items-center justify-center gap-1 bg-red-950/40">
                    {[...Array(12)].map((_, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-rose-700 shadow-sm animate-pulse"
                      />
                    ))}
                    <span className="absolute bottom-1 text-[9px] font-mono font-bold text-rose-300 bg-slate-950/80 px-1 rounded">
                      AGLUTINASI (+)
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-red-600/40 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                      HOMOGEN (-)
                    </span>
                  </div>
                )
              ) : (
                <span className="text-[11px] text-slate-600">Belum diuji</span>
              )}
            </div>
            <button
              onClick={() => handleApplySerum('antiB')}
              disabled={testedSera.antiB}
              className={`mt-3 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                testedSera.antiB
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow'
              }`}
            >
              <Pipette className="w-3.5 h-3.5" />
              Teteskan Anti-B
            </button>
          </div>

          {/* Well 3: Serum Anti-Rh (Anti-D) */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center">
            <span className="text-xs font-semibold text-purple-400 mb-2">Serum Anti-Rh (Anti-D)</span>
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-purple-500/40 flex items-center justify-center relative overflow-hidden bg-slate-950">
              {testedSera.antiRh ? (
                currentPatient.antiRh ? (
                  <div className="w-full h-full flex flex-wrap p-2 items-center justify-center gap-1 bg-red-950/40">
                    {[...Array(12)].map((_, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-rose-700 shadow-sm animate-pulse"
                      />
                    ))}
                    <span className="absolute bottom-1 text-[9px] font-mono font-bold text-rose-300 bg-slate-950/80 px-1 rounded">
                      AGLUTINASI (+)
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-red-600/40 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                      HOMOGEN (-)
                    </span>
                  </div>
                )
              ) : (
                <span className="text-[11px] text-slate-600">Belum diuji</span>
              )}
            </div>
            <button
              onClick={() => handleApplySerum('antiRh')}
              disabled={testedSera.antiRh}
              className={`mt-3 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                testedSera.antiRh
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow'
              }`}
            >
              <Pipette className="w-3.5 h-3.5" />
              Teteskan Anti-Rh
            </button>
          </div>
        </div>
      </div>

      {/* Decision Section: Determine Blood Type and Choose Donor */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Diagnose Blood Type */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
          <label className="text-xs font-semibold text-slate-200 block">
            1. Tentukan Golongan Darah Pasien:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  sound.playClick();
                  setSelectedType(type);
                }}
                className={`py-2 rounded-lg font-mono font-bold text-xs transition border ${
                  selectedType === type
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Choose Donor Blood */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
          <label className="text-xs font-semibold text-slate-200 block">
            2. Pilih Kantong Darah Donor yang Aman:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((donor) => (
              <button
                key={donor}
                onClick={() => {
                  sound.playClick();
                  setSelectedDonor(donor);
                }}
                className={`py-2 rounded-lg font-mono font-bold text-xs transition border ${
                  selectedDonor === donor
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {donor}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handleCheckDiagnosis}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
        >
          <CheckCircle className="w-4 h-4" />
          Verifikasi & Lakukan Transfusi
        </button>

        <button
          onClick={handleNextPatient}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Pasien Berikutnya
        </button>
      </div>

      {/* Result feedback */}
      {resultMessage && (
        <div
          className={`mt-4 p-4 rounded-xl border flex items-start gap-3 text-xs ${
            resultMessage.success
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
          }`}
        >
          {resultMessage.success ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="leading-relaxed">{resultMessage.text}</div>
        </div>
      )}
    </div>
  );
};
