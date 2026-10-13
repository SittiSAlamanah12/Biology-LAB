import { QuizQuestion } from '../types/biology';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ===================== KELAS 10 SMA =====================
  {
    id: 'q10-1',
    grade: '10',
    topic: 'Struktur Virus & Siklus Litik/Lisogenik',
    question: 'Bakteriofag T4 menyerang bakteri E. coli. Tahapan di mana materi genetik virus menyisip ke dalam kromosom inang tanpa langsung melisiskan sel inang disebut siklus...',
    options: [
      'Siklus Litik',
      'Siklus Lisogenik',
      'Siklus Adsorpsi',
      'Siklus Replikasi Mandiri'
    ],
    correctAnswerIndex: 1,
    explanation: 'Pada siklus lisogenik, profag (DNA virus) menyatu dengan kromosom DNA bakteri inang dan ikut membelah saat bakteri membelah tanpa langsung merusak atau melisiskan membran inang.',
    difficulty: 'Mudah',
    badge: 'Materi Virus'
  },
  {
    id: 'q10-2',
    grade: '10',
    topic: 'Monera & Bakteriologi',
    question: 'Bakteri Gram positif tampak berwarna ungu setelah pewarnaan Gram karena memiliki...',
    options: [
      'Lapisan peptidoglikan yang sangat tebal pada dinding selnya',
      'Membran luar berlapis lipopolisakarida tebal',
      'Kapsul lendir yang menyerap pewarna safranin',
      'Banyak flagela peritrik yang mengikat kristal violet'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dinding sel bakteri Gram-positif memiliki lapisan peptidoglikan tebal (20-80 nm) yang menjebak kompleks kristal violet-iodin sehingga tidak terlarut saat dicuci alkohol, menghasilkan warna ungu pekat.',
    difficulty: 'Sedang',
    badge: 'Monera'
  },
  {
    id: 'q10-3',
    grade: '10',
    topic: 'Ekologi & Piramida Energi',
    question: 'Berdasarkan hukum efisiensi transfer energi Lindeman dalam rantai makanan, persentase energi kimia yang berhasil diteruskan dari satu tingkat trofik ke tingkat trofik berikutnya rata-rata hanya sebesar...',
    options: [
      'Sekitar 90%',
      'Sekitar 50%',
      'Sekitar 10%',
      'Sekitar 1%'
    ],
    correctAnswerIndex: 2,
    explanation: 'Hukum 10% menyatakan bahwa sekitar 90% energi hilang sebagai panas metabolisme, respirasi, dan biomassa yang tak tercerna; hanya sekitar 10% energi yang berpindah ke tingkat trofik berikutnya.',
    difficulty: 'Mudah',
    badge: 'Ekosistem'
  },
  {
    id: 'q10-4',
    grade: '10',
    topic: 'Keanekaragaman Hayati',
    question: 'Garis maya yang memisahkan wilayah persebaran fauna tipe Asiatis dan tipe Peralihan (Wallacea) di Indonesia melewati antara pulau Kalimantan dan Sulawesi adalah garis...',
    options: [
      'Garis Wallace',
      'Garis Weber',
      'Garis Lydekker',
      'Garis Khatulistiwa'
    ],
    correctAnswerIndex: 0,
    explanation: 'Garis Wallace membatasi fauna tipe Asiatis (Sumatera, Jawa, Kalimantan) dengan tipe Peralihan (Sulawesi, Nusa Tenggara). Sedangkan Garis Weber membatasi fauna tipe Peralihan dengan tipe Australis (Papua, Maluku).',
    difficulty: 'Sedang',
    badge: 'Biodiversitas'
  },

  // ===================== KELAS 11 SMA =====================
  {
    id: 'q11-1',
    grade: '11',
    topic: 'Biologi Seluler & Transpor Membran',
    question: 'Jika sel darah merah (eritrosit) dimasukkan ke dalam larutan garam 5% (larutan hipertonis), fenomena mikroskopis yang akan terjadi pada sel adalah...',
    options: [
      'Hemolisis (sel membengkak lalu pecah)',
      'Krenasi (sel mengerut akibat kehilangan air)',
      'Plasmolisis (dinding sel terlepas dari membran)',
      'Turgid (sel menjadi kaku optimal)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Dalam larutan hipertonik, air keluar dari eritrosit secara osmosis menuju larutan berkonsentrasi lebih pekat, menyebabkan membran eritrosit mengerut (krenasi). Plasmolisis hanya terjadi pada sel berdinding sel (seperti tumbuhan).',
    difficulty: 'Sedang',
    badge: 'Transpor Membran'
  },
  {
    id: 'q11-2',
    grade: '11',
    topic: 'Sistem Peredaran Darah (Sirkulasi)',
    question: 'Seorang pasien memiliki tekanan darah 120/80 mmHg. Angka 80 mmHg merepresentasikan tekanan darah saat...',
    options: [
      'Ventrikel berkontraksi memompa darah ke aorta (Sistol)',
      'Ventrikel berelaksasi dan terisi darah dari atrium (Diastol)',
      'Katup aorta dan pulmonalis terbuka lebar',
      'Tekanan maksimum saat jantung berdenyut cepat'
    ],
    correctAnswerIndex: 1,
    explanation: 'Angka bawah (80 mmHg) adalah tekanan diastolik, yakni tekanan pada arteri ketika bilik jantung berelaksasi di antara detak dan mengalami pengisian volume darah.',
    difficulty: 'Mudah',
    badge: 'Sistem Sirkulasi'
  },
  {
    id: 'q11-3',
    grade: '11',
    topic: 'Sistem Ekskresi & Pembentukan Urine',
    question: 'Proses pembentukan urine pada nefron yang berlangsung di Tubulus Kontortus Proksimal dan menghasilkan urine sekunder dinamakan tahap...',
    options: [
      'Filtrasi',
      'Reabsorpsi',
      'Augmentasi',
      'Ekskresi'
    ],
    correctAnswerIndex: 1,
    explanation: 'Reabsorpsi terjadi terutama di Tubulus Kontortus Proksimal (TKP), menyerap kembali zat-zat yang masih berguna (glukosa, asam amino, ion Na+, air) dari urine primer sehingga menghasilkan urine sekunder.',
    difficulty: 'Mudah',
    badge: 'Sistem Ekskresi'
  },
  {
    id: 'q11-4',
    grade: '11',
    topic: 'Sistem Koordinasi & Transmisi Impuls Saraf',
    question: 'Keberadaan selubung mielin dan Nodus Ranvier memungkinkan impuls saraf merambat jauh lebih cepat karena mekanisme...',
    options: [
      'Konduksi saltatori (impuls melompat antar-nodus)',
      'Difusi sederhana neurotransmiter di sepanjang sitoplasma',
      'Peningkatan produksi asetilkolin di dalam badan sel',
      'Penutupan total seluruh kanal ion natrium secara permanen'
    ],
    correctAnswerIndex: 0,
    explanation: 'Konduksi saltatori memungkinkan potensial aksi melompat dari satu Nodus Ranvier ke Nodus Ranvier berikutnya, menaikkan kecepatan hantar impuls hingga mencapai ~120 meter/detik.',
    difficulty: 'Sedang',
    badge: 'Sistem Saraf'
  },
  {
    id: 'q11-5',
    grade: '11',
    topic: 'Sistem Imun & Antibodi',
    question: 'Antibodi yang paling banyak terdapat dalam kolostrum ASI pertama dan cairan sekresi mukosa tubuh (air liur, air mata) adalah imunoglobulin jenis...',
    options: [
      'IgG',
      'IgA',
      'IgM',
      'IgE'
    ],
    correctAnswerIndex: 1,
    explanation: 'Imunoglobulin A (IgA) adalah antibodi utama pada cairan sekresi mukosa tubuh dan kolostrum ASI, memberikan kekebalan pasif alami penting bagi saluran pencernaan bayi.',
    difficulty: 'Sedang',
    badge: 'Sistem Imun'
  },

  // ===================== KELAS 12 SMA & SOAL HOTS UTBK =====================
  {
    id: 'q12-1',
    grade: '12',
    topic: 'Sintesis Protein & Kodon Genetika',
    question: 'Kodon mRNA yang bertindak sebagai kodon awal (start codon) sekaligus mengkode asam amino Metionin pada sintesis protein eukariotik adalah...',
    options: [
      'UAA',
      'AUG',
      'UGA',
      'UAG'
    ],
    correctAnswerIndex: 1,
    explanation: 'AUG adalah kodon mulai (start codon) yang memberi sinyal pada ribosom untuk mengawali translasi dan mengkode asam amino metionin. UAA, UAG, dan UGA adalah kodon stop (tanpa asam amino).',
    difficulty: 'Mudah',
    badge: 'Genetika'
  },
  {
    id: 'q12-2',
    grade: '12',
    topic: 'Metabolisme: Respirasi Aerob',
    question: 'Pada tahapan respirasi seluler aerobik, tahapan yang menghasilkan molekul ATP terbanyak melalui pembentukan gradien proton (kemiosmosis) di krista mitokondria adalah...',
    options: [
      'Glikolisis',
      'Dekarboksilasi Oksidatif',
      'Siklus Krebs (Asam Sitrat)',
      'Sistem Transpor Elektron & Fosforilasi Oksidatif'
    ],
    correctAnswerIndex: 3,
    explanation: 'Sistem Transpor Elektron (STE) dan Fosforilasi Oksidatif menghasilkan sekitar 28-34 molekul ATP per molekul glukosa melalui aliran elektron dari NADH & FADH2 ke akseptor terakhir O2 yang memutar ATP sintase.',
    difficulty: 'Sedang',
    badge: 'Metabolisme'
  },
  {
    id: 'q12-3',
    grade: '12',
    topic: 'HOTS: Pembelahan Sel Meiosis',
    question: 'Peristiwa pindah silang (crossing over) antara kromatid bukan saudara dari pasangan kromosom homolog yang meningkatkan variasi genetik terjadi pada fase meiosis...',
    options: [
      'Profase I (subfase Pakiten)',
      'Metafase I',
      'Anafase I',
      'Telofase II'
    ],
    correctAnswerIndex: 0,
    explanation: 'Pindah silang (crossing over) terjadi pada Profase I subfase Pakiten di mana kromatid homolog saling melilit membentuk kiasma dan bertukar segmen materi genetik.',
    difficulty: 'HOTS / Sulit',
    badge: 'Pembelahan Sel'
  },
  {
    id: 'q12-4',
    grade: '12',
    topic: 'HOTS: Hukum Mendel & Persilangan Dihibrid',
    question: 'Tanaman ercis biji bulat kuning (BbKk) disilangkan sesamanya. Berapa persentase kemungkinan keturunan yang memiliki fenotipe biji keriput kuning (keriput resesif bb, kuning dominan K_)?',
    options: [
      '9/16 (56.25%)',
      '3/16 (18.75%)',
      '1/16 (6.25%)',
      '12/16 (75%)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Pada persilangan dihibrid heterozigot (BbKk x BbKk), rasio fenotipe keturunannya adalah 9 Bulat Kuning : 3 Keriput Kuning : 3 Bulat Hijau : 1 Keriput Hijau. Peluang keriput kuning adalah 3/16 atau 18.75%.',
    difficulty: 'HOTS / Sulit',
    badge: 'Genetika Mendel'
  },
  {
    id: 'q12-5',
    grade: '12',
    topic: 'HOTS: Teori Evolusi & Seleksi Alam',
    question: 'Berdasarkan Hukum Hardy-Weinberg (p² + 2pq + q² = 1), frekuensi alel dalam suatu populasi akan tetap seimbang (konstan) dari generasi ke generasi apabila memenuhi syarat...',
    options: [
      'Terjadi mutasi genetik acak yang intensif',
      'Ukuran populasi sangat besar, perkawinan acak, dan tidak ada migrasi maupun seleksi alam',
      'Terjadi genetic drift dan efek leher botol (bottleneck effect)',
      'Perkawinan terjadi secara selektif (assortative mating)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Kesetimbangan Hardy-Weinberg mensyaratkan 5 kondisi: populasi sangat besar, perkawinan terjadi secara acak (panmiksia), tidak ada mutasi, tidak ada migrasi (aliran gen), dan tidak ada seleksi alam.',
    difficulty: 'HOTS / Sulit',
    badge: 'Evolusi'
  }
];
