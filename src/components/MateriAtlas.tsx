import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { BookOpen, Search, Sparkles, Check, ArrowRight } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  category: string;
  grade: '10' | '11' | '12';
  definition: string;
  example: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Osmosis',
    category: 'Transpor Membran',
    grade: '11',
    definition: 'Perpindahan molekul pelarut (air) dari larutan hipotonik (encer) ke hipertonik (pekat) melalui membran semipermeabel.',
    example: 'Peristiwa mengerutnya sel darah merah (krenasi) dalam larutan garam pekat.',
  },
  {
    term: 'Homeostasis',
    category: 'Fisiologi Manusia',
    grade: '11',
    definition: 'Kemampuan sistem organ tubuh mempertahankan kestabilan kondisi internal (suhu, pH darah, kadar glukosa, volume cairan).',
    example: 'Pengeluaran keringat saat suhu tubuh meningkat untuk pendinginan evaporatif.',
  },
  {
    term: 'Kodon & Antikodon',
    category: 'Genetika Molekuler',
    grade: '12',
    definition: 'Kodon adalah urutan 3 basa nitrogen pada pita mRNA; Antikodon adalah 3 basa komplemen pada molekul tRNA pembawa asam amino.',
    example: 'Kodon AUG mengkode asam amino Metionin dengan antikodon tRNA UAC.',
  },
  {
    term: 'Konduksi Saltatori',
    category: 'Sistem Saraf',
    grade: '11',
    definition: 'Mekanisme transmisi impuls potensial aksi yang melompat dari satu Nodus Ranvier ke Nodus Ranvier berikutnya pada akson bermielin.',
    example: 'Meningkatkan laju rambat sinyal saraf hingga ~120 meter/detik.',
  },
  {
    term: 'Fosforilasi Oksidatif',
    category: 'Metabolisme Sel',
    grade: '12',
    definition: 'Tahapan respirasi sel aerob di krista mitokondria di mana gradien proton memutar enzim ATP sintase menghasilkan ~34 ATP.',
    example: 'Akseptor elektron terakhir pada proses ini adalah molekul O2 yang membentuk H2O.',
  },
  {
    term: 'Bakteriofag',
    category: 'Virologi',
    grade: '10',
    definition: 'Jenis virus yang menginfeksi dan bereplikasi di dalam tubuh sel bakteri.',
    example: 'Fag T4 yang menginfeksi bakteri Escherichia coli.',
  },
  {
    term: 'Eutrofikasi',
    category: 'Ekologi & Lingkungan',
    grade: '10',
    definition: 'Peledakan populasi alga dan eceng gondok akibat penumpukan nutrien nitrat dan fosfat dari limbah pupuk/detergen.',
    example: 'Menyebabkan kematian ikan di danau akibat deplesi oksigen terlarut (anoksia).',
  },
];

export const MateriAtlas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeComparison, setActiveComparison] = useState<'sel' | 'mitosis' | 'pembuluh'>('sel');

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Comparative Study Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Tabel Komparasi Konsep Inti Biologi SMA
            </span>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Perbandingan Konsep Penting Ujian
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pahami perbedaan mendasar materi yang sering diujikan di Ujian Sekolah & UTBK SNBT.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setActiveComparison('sel');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeComparison === 'sel'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sel Hewan vs Tumbuhan
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveComparison('mitosis');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeComparison === 'mitosis'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mitosis vs Meiosis
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveComparison('pembuluh');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeComparison === 'pembuluh'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Arteri vs Vena
            </button>
          </div>
        </div>

        {/* Comparison Tables */}
        {activeComparison === 'sel' && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-4">Parameter Karakteristik</th>
                  <th className="py-2.5 px-4 text-emerald-400 font-bold">Sel Hewan</th>
                  <th className="py-2.5 px-4 text-cyan-400 font-bold">Sel Tumbuhan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Dinding Sel</td>
                  <td className="py-3 px-4">Tidak ada (hanya membran sel tipis & fleksibel)</td>
                  <td className="py-3 px-4 text-emerald-300">Ada (tersusun atas serat selulosa & pektin kaku)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Kloroplas (Plastida)</td>
                  <td className="py-3 px-4">Tidak ada (bersifat heterotrof)</td>
                  <td className="py-3 px-4 text-emerald-300">Ada (tempat fotosintesis berklorofil)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Vakuola</td>
                  <td className="py-3 px-4">Kecil dan banyak (atau tidak ada)</td>
                  <td className="py-3 px-4 text-emerald-300">Satu vakuola sentral besar penyimpan turgor</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Sentrosom & Sentriol</td>
                  <td className="py-3 px-4 text-emerald-300">Ada (memandu gelendong pembelahan mitosis)</td>
                  <td className="py-3 px-4">Tidak ada (kecuali tumbuhan tingkat rendah)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Cadangan Makanan</td>
                  <td className="py-3 px-4">Glikogen & lemak</td>
                  <td className="py-3 px-4 text-emerald-300">Amilum (pati)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeComparison === 'mitosis' && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-4">Parameter Karakteristik</th>
                  <th className="py-2.5 px-4 text-emerald-400 font-bold">Mitosis</th>
                  <th className="py-2.5 px-4 text-purple-400 font-bold">Meiosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Lokasi Terjadinya</td>
                  <td className="py-3 px-4">Sel tubuh somatis</td>
                  <td className="py-3 px-4 text-purple-300">Sel gamet gonosom (testis & ovarium)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Jumlah Pembelahan</td>
                  <td className="py-3 px-4">1 kali pembelahan (PMAT)</td>
                  <td className="py-3 px-4 text-purple-300">2 kali pembelahan (Meiosis I & Meiosis II)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Hasil Sel Anakan</td>
                  <td className="py-3 px-4">2 sel anakan identik diploid (2n)</td>
                  <td className="py-3 px-4 text-purple-300">4 sel anakan haploid (n) bervariasi genetik</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Pindah Silang (Crossing Over)</td>
                  <td className="py-3 px-4">Tidak terjadi</td>
                  <td className="py-3 px-4 text-purple-300">Terjadi pada Profase I (subfase pakiten)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Fungsi Biologis</td>
                  <td className="py-3 px-4">Pertumbuhan & perbaikan jaringan rusak</td>
                  <td className="py-3 px-4 text-purple-300">Pembentukan sel kelamin & variasi genetik</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeComparison === 'pembuluh' && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-4">Parameter</th>
                  <th className="py-2.5 px-4 text-rose-400 font-bold">Arteri (Pembuluh Nadi)</th>
                  <th className="py-2.5 px-4 text-blue-400 font-bold">Vena (Pembuluh Balik)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Arah Aliran Darah</td>
                  <td className="py-3 px-4 text-rose-300">Meninggalkan jantung</td>
                  <td className="py-3 px-4 text-blue-300">Menuju ke jantung</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Dinding Pembuluh</td>
                  <td className="py-3 px-4">Tebal, elastis, berotot kuat</td>
                  <td className="py-3 px-4">Tipis dan kurang elastis</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Tekanan & Aliran Darah</td>
                  <td className="py-3 px-4">Kuat (bila terluka darah memancar)</td>
                  <td className="py-3 px-4">Lemah (bila terluka darah menetes)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Jumlah Katup (Valvula)</td>
                  <td className="py-3 px-4">Satu di pangkal keluar jantung</td>
                  <td className="py-3 px-4">Banyak di sepanjang pembuluh cegah aliran balik</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-200">Kandungan Gas Darah</td>
                  <td className="py-3 px-4">Kaya O2 (kecuali arteri pulmonalis)</td>
                  <td className="py-3 px-4">Kaya CO2 (kecuali vena pulmonalis)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Biology Glossary Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Kamus Istilah Biologi SMA
            </span>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Glosarium Pintar & Konsep Esensial
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari istilah biologi..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredGlossary.map((term, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition flex flex-col justify-between text-xs space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-100 text-sm text-emerald-400">
                    {term.term}
                  </h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Kelas {term.grade}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400/80 font-mono block mt-0.5">
                  Topik: {term.category}
                </span>
                <p className="text-slate-300 mt-2 leading-relaxed text-[11.5px]">
                  {term.definition}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                Contoh: {term.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
