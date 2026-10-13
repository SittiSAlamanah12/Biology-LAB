import { BioModelInfo } from '../types/biology';

export const BIOLOGY_MODELS: BioModelInfo[] = [
  // ===================== ORGAN TUBUH MANUSIA =====================
  {
    id: 'jantung',
    name: 'Jantung Manusia (Cor)',
    category: 'organ',
    grade: '11',
    curriculumTopic: 'Sistem Sirkulasi / Peredaran Darah',
    summary: 'Organ berotot miokardium yang memompa darah kaya oksigen ke seluruh tubuh dan darah miskin oksigen ke paru-paru.',
    description: 'Jantung manusia memiliki 4 ruang terpisah: dua atrium (serambi) dan dua ventrikel (bilik). Bekerja secara ritmis otonom dipicu oleh Nodus Sinoatrialis (SA Node/Pacemaker alami) dengan siklus sistol (kontraksi memompa) dan diastol (relaksasi pengisian).',
    facts: [
      'Jantung memompa sekitar 7.200 liter darah setiap hari melalui lebih dari 96.000 km pembuluh darah.',
      'Siklus detak jantung menghasilkan bunyi "Lub-Dub": Lub (penutupan katup AV trikuspid & bikuspid) dan Dub (penutupan katup semilunaris aorta & pulmonalis).',
      'Tekanan darah normal remaja SMA berkisar 120/80 mmHg (sistol 120 mmHg, diastol 80 mmHg).'
    ],
    keyMolecules: ['Hemoglobin (Hb)', 'Mioglobin', 'Kalsium (Ca2+)', 'Troponin & Tropomiosin', 'ATP'],
    interactiveControls: {
      hasPulseAnimation: true,
      hasExplodeView: true
    },
    parts: [
      {
        id: 'aorta',
        name: 'Aorta & Arcus Aorta',
        latinName: 'Aorta ascendens et Arcus aortae',
        functionDesc: 'Arteri terbesar tubuh yang mengalirkan darah bertekanan tinggi kaya O2 dari bilik kiri ke sirkulasi sistemik.',
        detail: 'Memiliki 3 cabang utama pada lengkung aorta: Arteri brakiosefalika, Arteri karotis komunis sinistra, dan Arteri subklavia sinistra.',
        clinicalNote: 'Aterosklerosis (penumpukan plak lemak) pada aorta dapat memicu aneurisma aorta atau hipertensi.',
        position: [0.1, 1.8, 0.2],
        color: '#ef4444'
      },
      {
        id: 'atrium-dexter',
        name: 'Serambi Kanan (Atrium Kanan)',
        latinName: 'Atrium dextrum',
        functionDesc: 'Menerima darah kaya CO2 dari seluruh tubuh melalui Vena Cava Superior dan Vena Cava Inferior.',
        detail: 'Di dinding atrium kanan terdapat Nodus SA (pacemaker alami) yang membangkitkan impuls listrik spontan sekitar 60-100 kali per menit.',
        clinicalNote: 'Fibrilasi atrium dapat menyebabkan darah menggumpal dan memicu risiko stroke emboli.',
        position: [-1.2, 0.4, 0.3],
        color: '#3b82f6'
      },
      {
        id: 'ventrikel-sinister',
        name: 'Bilik Kiri (Ventrikel Kiri)',
        latinName: 'Ventriculus sinister',
        functionDesc: 'Memompa darah bertekanan tinggi kaya O2 ke seluruh tubuh melalui katup aorta.',
        detail: 'Memiliki dinding miokardium paling tebal (3-4x lebih tebal dari bilik kanan) karena harus melawan resistensi perifer seluruh organ tubuh.',
        clinicalNote: 'Hipertensi kronis dapat memicu hipertrofi ventrikel kiri (LVH) dan akhirnya gagal jantung kongestif.',
        position: [0.9, -0.6, 0.4],
        color: '#dc2626'
      },
      {
        id: 'ventrikel-dexter',
        name: 'Bilik Kanan (Ventrikel Kanan)',
        latinName: 'Ventriculus dexter',
        functionDesc: 'Memompa darah kaya CO2 ke paru-paru melalui arteri pulmonalis untuk difusi gas.',
        detail: 'Tekanan darah di ventrikel kanan jauh lebih rendah dibanding ventrikel kiri (~25 mmHg sistol) agar kapiler alveolus tidak pecah.',
        clinicalNote: 'Stenosis katup pulmonalis menyebabkan bilik kanan bekerja ekstra keras memompa darah ke paru-paru.',
        position: [-0.7, -0.5, 0.6],
        color: '#2563eb'
      },
      {
        id: 'arteri-pulmonalis',
        name: 'Arteri Pulmonalis',
        latinName: 'Truncus pulmonalis',
        functionDesc: 'Membawa darah miskin O2 dari bilik kanan menuju paru-paru (satu-satunya arteri dewasa pembawa darah miskin O2).',
        detail: 'Bercabang menjadi arteri pulmonalis dekstra (ke paru kanan) dan sinistra (ke paru kiri).',
        clinicalNote: 'Emboli paru (sumbatan bekuan darah di arteri pulmonalis) adalah kegawatdaruratan medis fatal.',
        position: [-0.3, 1.4, 0.8],
        color: '#60a5fa'
      },
      {
        id: 'vena-cava',
        name: 'Vena Cava Superior & Inferior',
        latinName: 'Vena cava superior et inferior',
        functionDesc: 'Vena terbesar yang mengembalikan darah terdeoksigenasi dari tubuh bagian atas dan bawah ke serambi kanan.',
        detail: 'Vena cava superior menampung darah dari kepala, leher, dada, dan lengan; inferior dari perut dan ekstremitas bawah.',
        clinicalNote: 'Sindrom Vena Cava Superior terjadi bila tumor mendesak aliran balik vena di mediastinum.',
        position: [-1.5, 1.5, -0.4],
        color: '#1d4ed8'
      }
    ]
  },
  {
    id: 'otak',
    name: 'Otak Manusia (Encephalon)',
    category: 'organ',
    grade: '11',
    curriculumTopic: 'Sistem Koordinasi & Regulasi Saraf',
    summary: 'Pusat pengendali sistem saraf pusat yang mengatur kesadaran, memori, emosi, bahasa, koordinasi gerak, dan fungsi vital tubuh.',
    description: 'Terdiri atas Otak Besar (Serebrum) dengan 4 lobus spesifik, Otak Kecil (Serebelum) untuk koordinasi motorik halus, dan Batang Otak (Trunkus Ensefali) yang meregulasi pernapasan serta detak jantung.',
    facts: [
      'Otak manusia hanya berbobot 2% berat badan, tetapi mengonsumsi 20% glukosa dan oksigen tubuh.',
      'Mengandung sekitar 86 miliar neuron yang terhubung melalui triliunan sinapsis kimiawi dan listrik.',
      'Dilindungi oleh 3 lapisan selaput meninges: Duramater, Araknoid, dan Piamater, serta cairan serebrospinal (CSF).'
    ],
    keyMolecules: ['Dopamin', 'Serotonin', 'Asetilkolin (ACh)', 'GABA', 'Glutamat'],
    interactiveControls: {
      hasSignalFlow: true,
      hasExplodeView: true
    },
    parts: [
      {
        id: 'lobus-frontalis',
        name: 'Lobus Frontal (Depan)',
        latinName: 'Lobus frontalis',
        functionDesc: 'Pusat penalaran logis, perencanaan, pengambilan keputusan, kepribadian, dan area motorik primer (korteks motorik).',
        detail: 'Juga memuat Area Broca yang mengatur kemampuan artikulasi motorik dalam memproduksi kata dan ucapan lisan.',
        clinicalNote: 'Kerusakan area Broca mengakibatkan Afasia Motorik: pasien memahami kata tetapi sulit berbicara lancar.',
        position: [0, 0.9, 1.3],
        color: '#f59e0b'
      },
      {
        id: 'lobus-temporalis',
        name: 'Lobus Temporal (Samping)',
        latinName: 'Lobus temporalis',
        functionDesc: 'Pusat pemrosesan memori jangka panjang, pendengaran, dan pemahaman bahasa (Area Wernicke).',
        detail: 'Di bagian dalam lobus temporal terletak Hipokampus yang krusial untuk konsolidasi memori spasial dan deklaratif.',
        clinicalNote: 'Kerusakan lobus temporal dan hipokampus menjadi ciri khas patologi Penyakit Alzheimer.',
        position: [1.3, -0.1, 0.2],
        color: '#10b981'
      },
      {
        id: 'lobus-parietalis',
        name: 'Lobus Parietal (Atas)',
        latinName: 'Lobus parietalis',
        functionDesc: 'Pusat integrasi sensorik somatosensori: peraba, suhu, nyeri, tekanan, dan orientasi spasial tubuh (propriosepsi).',
        detail: 'Mengandung girus pascasentral yang memetakan indra peraba dari seluruh permukaan tubuh manusia (Homunculus sensorik).',
        clinicalNote: 'Kerusakan lobus parietal inferior kanan dapat menimbulkan spatial hemineglect (mengabaikan sisi kiri ruang).',
        position: [0, 1.2, -0.5],
        color: '#8b5cf6'
      },
      {
        id: 'lobus-occipitalis',
        name: 'Lobus Oksipital (Belakang)',
        latinName: 'Lobus occipitalis',
        functionDesc: 'Pusat persepsi dan interpretasi visual primer dari impuls cahaya yang dihantarkan nervus optikus.',
        detail: 'Menganalisis warna, orientasi garis, gerakan, dan pengenalan wajah pada area asosiasi visual.',
        clinicalNote: 'Benturan keras pada belakang kepala dapat menyebabkan kebutaan kortikal sementara walau bola mata utuh.',
        position: [0, 0.4, -1.6],
        color: '#ec4899'
      },
      {
        id: 'cerebellum',
        name: 'Otak Kecil (Serebelum)',
        latinName: 'Cerebellum',
        functionDesc: 'Mengkoordinasikan kehalusan gerak otot rangka, postur, keseimbangan tubuh, dan memori motorik prosedural.',
        detail: 'Mengandung neuron sel Purkinje yang memiliki cabang dendrit paling kompleks dalam sistem saraf manusia.',
        clinicalNote: 'Gangguan serebelum menimbulkan Ataksia: gerakan tubuh canggung, limbung, dan hilangnya koordinasi jari.',
        position: [0, -0.9, -1.1],
        color: '#06b6d4'
      },
      {
        id: 'batang-otak',
        name: 'Batang Otak (Trunkus Ensefali)',
        latinName: 'Truncus encephali (Medulla oblongata, Pons, Mesencephalon)',
        functionDesc: 'Pusat otonom vital tubuh: ritme napas, tekanan darah, denyut jantung, refleks menelan, bersin, dan batuk.',
        detail: 'Menghubungkan otak besar dan kecil dengan sumsum tulang belakang (Medulla spinalis).',
        clinicalNote: 'Kematian batang otak (brain death) menjadi kriteria legal henti kehidupan biologis.',
        position: [0, -1.4, -0.2],
        color: '#f97316'
      }
    ]
  },
  {
    id: 'paru-paru',
    name: 'Paru-paru & Cabang Bronkus (Pulmo)',
    category: 'organ',
    grade: '11',
    curriculumTopic: 'Sistem Pernapasan / Respirasi',
    summary: 'Organ utama pertukaran gas O2 dan CO2 antara udara luar atmosfer dan kapiler darah melalui ratusan juta alveolus.',
    description: 'Paru-paru kanan memiliki 3 lobus (superior, medius, inferior), sedangkan paru-paru kiri memiliki 2 lobus untuk memberi ruang bagi letak jantung (incisura cardiaca). Percabangan trakea menuju bronkus primer, sekunder, bronkiolus, hingga kantung alveoli.',
    facts: [
      'Luas permukaan total alveoli jika dibentangkan mencapai 70 hingga 100 meter persegi (setara lapangan tenis).',
      'Surfaktan paru yang diproduksi sel pneumosit tipe II mencegah kolapsnya alveolus saat ekspirasi berkat penurunan tegangan permukaan.',
      'Udara residu (sekitar 1.200 mL) selalu tersisa di paru-paru agar alveoli tidak saling melekat setelah menghembuskan napas maksimal.'
    ],
    keyMolecules: ['Oksigen (O2)', 'Karbon Dioksida (CO2)', 'Surfaktan Dipalmitoilfosfatidilkolin', 'Karbonat Anhidrase'],
    interactiveControls: {
      hasBreathingAnimation: true,
      hasExplodeView: true
    },
    parts: [
      {
        id: 'trakea',
        name: 'Trakea (Tenggorokan)',
        latinName: 'Trachea',
        functionDesc: 'Saluran tulang rawan hialin berbentuk cincin huruf C yang menyalurkan udara bersih ke percabangan bronkus.',
        detail: 'Dilapisi epitel kolumnar pseudoberlapis bersilia dengan sel goblet penghasil lendir untuk menjebak debu dan patogen.',
        clinicalNote: 'Asap rokok melumpuhkan silia trakea, sehingga kotoran menumpuk dan memicu batuk perokok kronis.',
        position: [0, 1.8, 0],
        color: '#e2e8f0'
      },
      {
        id: 'bronkus-dekstra',
        name: 'Bronkus Primer Kanan',
        latinName: 'Bronchus principalis dexter',
        functionDesc: 'Saluran udara menuju paru kanan; lebih lebar, pendek, dan tegak dibanding bronkus kiri.',
        detail: 'Karena posisinya yang lebih tegak, benda asing yang tersedak lebih sering masuk ke percabangan paru-paru kanan.',
        clinicalNote: 'Bronkitis adalah peradangan dinding bronkus yang memicu hipersekresi lendir kental dan sesak napas.',
        position: [-0.6, 0.8, 0],
        color: '#94a3b8'
      },
      {
        id: 'pulmo-dexter',
        name: 'Paru-Paru Kanan (3 Lobus)',
        latinName: 'Pulmo dexter (Lobus superior, medius, inferior)',
        functionDesc: 'Menampung udara inspirasi pada sisi kanan toraks, memiliki volume dan massa lebih besar daripada paru kiri.',
        detail: 'Dipisahkan oleh fisura horisontalis dan fisura obliqua menjadi 3 lobus fungsional.',
        clinicalNote: 'Pneumonia menyebabkan eksudat cairan memenuhi lobus paru kanan dan mereduksi kapasitas difusi O2.',
        position: [-1.4, -0.2, 0.2],
        color: '#f43f5e'
      },
      {
        id: 'pulmo-sinister',
        name: 'Paru-Paru Kiri (2 Lobus)',
        latinName: 'Pulmo sinister (Lobus superior, inferior)',
        functionDesc: 'Menampung udara inspirasi pada sisi kiri toraks dengan cekungan khusus tempat jantung (cardiac notch).',
        detail: 'Hanya memiliki fisura obliqua dan lingula pulmonis yang ekuivalen dengan lobus medius paru kanan.',
        clinicalNote: 'Pleura parietal dan viseral yang membungkus paru dapat mengalami efusi pleura (penumpukan cairan berlebih).',
        position: [1.4, -0.2, 0.2],
        color: '#fb7185'
      },
      {
        id: 'alveolus-cluster',
        name: 'Alveoli (Kantung Udara Mikroskopis)',
        latinName: 'Alveoli pulmonis',
        functionDesc: 'Tempat difusi O2 dari udara ke eritrosit darah dan difusi CO2 dari plasma darah ke rongga alveolus.',
        detail: 'Membran respirasi hanya setebal 0.5 mikrometer, terdiri dari pneumosit tipe I gepeng tipis dan endotelium kapiler.',
        clinicalNote: 'Emfisema (akibat polusi/rokok) merusak dinding sekat antar-alveoli, memperkecil luas permukaan difusi gas.',
        position: [0.9, -1.0, 0.4],
        color: '#fda4af'
      }
    ]
  },
  {
    id: 'ginjal',
    name: 'Ginjal & Nefron (Ren)',
    category: 'organ',
    grade: '11',
    curriculumTopic: 'Sistem Ekskresi & Osmoregulasi',
    summary: 'Organ penyaring darah dari zat sisa metabolisme (urea, amonia, asam urat) dan pengatur homeostasis cairan serta elektrolit.',
    description: 'Setiap ginjal manusia memiliki sekitar 1 juta unit fungsional penyaring bernama nefron. Menghasilkan urine melalui 3 tahapan utama: Filtrasi di glomerulus (urine primer), Reabsorpsi di tubulus proksimal & Henle (urine sekunder), dan Augmentasi di tubulus distal (urine sesungguhnya).',
    facts: [
      'Kedua ginjal menyaring sekitar 180 liter cairan darah per hari, tetapi 99% diserap kembali sehingga urine yang keluar hanya 1-1,5 liter/hari.',
      'Hormon ADH (Antidiuretik) dari hipofisis posterior mengontrol penyerapan air di tubulus kolektivus ginjal.',
      'Ginjal juga memproduksi hormon eritropoietin (EPO) yang merangsang sumsum tulang membentuk sel darah merah.'
    ],
    keyMolecules: ['Urea', 'Kreatinin', 'Ion Na+, K+, Cl-', 'Glukosa', 'Hormon ADH', 'Aldosteron'],
    interactiveControls: {
      hasExplodeView: true
    },
    parts: [
      {
        id: 'korteks-renalis',
        name: 'Korteks Ginjal (Kulit Ginjal)',
        latinName: 'Cortex renalis',
        functionDesc: 'Lapisan luar ginjal tempat berjuta-juta Glomerulus dan Tubulus Kontortus Proksimal menjalankan filtrasi dan reabsorpsi awal.',
        detail: 'Kaya akan anyaman kapiler peritubular yang menyerap kembali zat esensial seperti glukosa, asam amino, dan air.',
        clinicalNote: 'Glomerulonefritis adalah radang pada glomerulus korteks yang menyebabkan protein dan darah lolos ke urine (hematuria & proteinuria).',
        position: [0.8, 0.8, 0.2],
        color: '#b91c1c'
      },
      {
        id: 'medula-piramid',
        name: 'Medula & Piramida Ginjal',
        latinName: 'Medulla renalis / Pyramides renales',
        functionDesc: 'Lapisan tengah berbentuk piramida bergaris-garis yang memuat Lengkung Henle dan Tubulus Kolektivus.',
        detail: 'Mekanisme countercurrent multiplier di lengkung Henle menciptakan gradien osmotik hipertonik untuk menghemat air tubuh.',
        clinicalNote: 'Nekrosis papiler medula dapat terjadi akibat penyalahgunaan obat analgetik antiinflamasi jangka panjang.',
        position: [-0.3, 0.2, 0.3],
        color: '#dc2626'
      },
      {
        id: 'pelvis-renalis',
        name: 'Pelvis Renalis (Piala Ginjal)',
        latinName: 'Pelvis renalis',
        functionDesc: 'Rongga corong penampung urine dari kaliks mayor sebelum dialirkan keluar melalui ureter menuju vesika urinaria.',
        detail: 'Dinding pelvis renalis tersusun atas epitel transisional yang elastis menyesuaikan volume tampung cairan.',
        clinicalNote: 'Batu ginjal (kalsium oksalat) sering mengendap dan tersangkut di pelvis renalis, menyebabkan kolik ginjal hebat.',
        position: [-0.9, -0.3, 0.1],
        color: '#fde047'
      },
      {
        id: 'ureter',
        name: 'Ureter',
        latinName: 'Ureter',
        functionDesc: 'Saluran pipa berotot polos yang mengalirkan urine dari pelvis ginjal ke kandung kemih melalui gerakan peristaltik.',
        detail: 'Panjang ureter sekitar 25-30 cm pada manusia dewasa, dengan katup lipatan fisiologis pencegah refluks urine balik ke ginjal.',
        clinicalNote: 'Penyumbatan batu di ureter dapat menyebabkan hidronefrosis (pembengkakan ginjal akibat urine terbendung).',
        position: [-0.9, -1.8, 0],
        color: '#facc15'
      },
      {
        id: 'arteri-vena-renalis',
        name: 'Arteri & Vena Renalis',
        latinName: 'Arteria et Vena renalis',
        functionDesc: 'Arteri renalis membawa 20% curah jantung darah kotor bertekanan tinggi untuk disaring; vena renalis mengembalikan darah bersih ke vena cava.',
        detail: 'Arteri renalis bercabang menjadi arteri interlobaris, arkuata, interlobularis, hingga arteriol aferen glomerulus.',
        clinicalNote: 'Stenosis arteri renalis memicu pelepasan renin berlebih oleh sel jukstaglomerulus, menyebabkan hipertensi renovaskular ganas.',
        position: [-1.4, 0.4, -0.2],
        color: '#3b82f6'
      }
    ]
  },

  // ===================== SEL BIOLOGI (3D CELLULAR) =====================
  {
    id: 'sel-hewan',
    name: 'Sel Hewan (Animal Cell)',
    category: 'sel',
    grade: '11',
    curriculumTopic: 'Struktur dan Fungsi Organel Sel Eukariotik',
    summary: 'Sel eukariotik fleksibel tanpa dinding sel, memiliki sentrosom untuk pembelahan, lisosom pencerna, dan mitokondria penghasil energi.',
    description: 'Sel hewan dikelilingi oleh membran plasma fosfolipid bilayer dengan model mosaik cair. Organel intraseluler tersuspensi di dalam sitoplasma sitosolik, didukung oleh jejaring sitoskeleton (mikrofilamen, filamen intermediet, dan mikrotubulus).',
    facts: [
      'Mitokondria memiliki DNA sirkuler dan ribosom sendiri, mendukung teori endosimbiosis evolusi sel.',
      'Lisosom dijuluki "kantong bunuh diri" (suicide bag) karena mengandung enzim hidrolitik untuk autolisis dan fagositosis materi usang.',
      'Sel hewan memiliki sentrosom berisi sepasang sentriol yang memandu spindel pembelahan saat mitosis dan meiosis.'
    ],
    keyMolecules: ['Fosfolipid Bilayer', 'ATP', 'DNA & RNA', 'Enzim Hidrolase Asam', 'Tubulin & Aktin'],
    interactiveControls: {
      hasExplodeView: true
    },
    parts: [
      {
        id: 'nukleus-hewan',
        name: 'Nukleus & Nukleolus',
        latinName: 'Nucleus et Nucleolus',
        functionDesc: 'Pusat komando pengendali aktivitas sel, penyimpan materi genetik DNA, dan perakit subunit ribosom (di nukleolus).',
        detail: 'Dikelilingi membran ganda berpori (pori nukleus) yang mengatur lalu lintas molekul RNA dan protein antar-sitoplasma.',
        clinicalNote: 'Mutasi DNA inti yang gagal diperbaiki sistem p53 dapat memicu pembelahan sel tak terkendali (kanker).',
        position: [0, 0, 0],
        color: '#8b5cf6'
      },
      {
        id: 'mitokondria-hewan',
        name: 'Mitokondria (Powerhouse of Cell)',
        latinName: 'Mitochondrion',
        functionDesc: 'Organel respirasi seluler aerobik yang menghasilkan molekul energi ATP melalui Siklus Krebs dan Fosforilasi Oksidatif.',
        detail: 'Memiliki membran luar halus dan membran dalam berlekuk-lekuk membentuk krista (cristae) untuk memperluas area sintesis ATP.',
        clinicalNote: 'Kerusakan mitokondria akibat stres oksidatif radikal bebas mempercepat penuaan seluler.',
        position: [0.9, 0.4, 0.7],
        color: '#f97316'
      },
      {
        id: 'retikulum-endoplasma-kasar',
        name: 'Retikulum Endoplasma Kasar (RE Kasar)',
        latinName: 'Reticulum endoplasmicum granulosum',
        functionDesc: 'Jejaring kantung membran pipih yang ditempeli ribosom; berfungsi memodifikasi dan mentransportasikan protein sekretori.',
        detail: 'Protein hasil sintesis ribosom dimasukkan ke lumen RE kasar untuk dilipat dan mengalami glikosilasi awal.',
        clinicalNote: 'ER stress terjadi ketika protein yang salah melipat (misfolded proteins) menumpuk di lumen RE.',
        position: [-0.6, 0.5, 0.3],
        color: '#3b82f6'
      },
      {
        id: 'badan-golgi',
        name: 'Aparatus Golgi (Badan Golgi)',
        latinName: 'Complexus golgiensis',
        functionDesc: 'Pusat sortir, modifikasi lanjutan, pengepakan, dan pengiriman glikoprotein ke lisosom, membran sel, atau disekresi keluar sel.',
        detail: 'Memiliki sisi cis (menerima vesikel transpor dari RE) dan sisi trans (melepaskan vesikel sekretori).',
        clinicalNote: 'Defek pemrosesan Golgi dapat mengganggu pembentukan enzim lisosom dan menyebabkan penyakit timbunan lisosom.',
        position: [0.6, -0.6, 0.4],
        color: '#10b981'
      },
      {
        id: 'lisosom',
        name: 'Lisosom',
        latinName: 'Lysosoma',
        functionDesc: 'Vesikel berisi lebih dari 50 jenis enzim hidrolitik asam (pH ~4.5-5.0) untuk mendaur ulang organel rusak (autofagi) dan melawan patogen.',
        detail: 'Membran lisosom memiliki pompa proton H+ ATPase untuk menjaga suasana asam internal organel.',
        clinicalNote: 'Penyakit Tay-Sachs disebabkan oleh mutasi defisiensi enzim heksosaminidase A di lisosom saraf.',
        position: [-0.8, -0.6, 0.5],
        color: '#ec4899'
      },
      {
        id: 'membran-sel-hewan',
        name: 'Membran Plasma',
        latinName: 'Membrana cellularis',
        functionDesc: 'Lapisan batas selektif permeabel pengatur transpor molekul (difusi, osmosis, pompa ion) dan komunikasi sinyal reseptor.',
        detail: 'Tersusun atas lapisan ganda fosfolipid dengan kepala hidrofilik dan ekor hidrofobik, disisipi protein integral, perifer, dan kolesterol.',
        clinicalNote: 'Kerusakan pompa Na+/K+ ATPase membran menyebabkan pembengkakan sel lisis karena air masuk secara osmosis.',
        position: [1.3, 0, -0.2],
        color: '#06b6d4'
      }
    ]
  },
  {
    id: 'sel-tumbuhan',
    name: 'Sel Tumbuhan (Plant Cell)',
    category: 'sel',
    grade: '11',
    curriculumTopic: 'Struktur Sel & Jaringan Tumbuhan',
    summary: 'Sel eukariotik autotrof dengan dinding sel selulosa kokoh, vakuola sentral besar penyimpan turgor, dan kloroplas fotosintesis.',
    description: 'Berbeda dengan sel hewan, sel tumbuhan memiliki bentuk tetap kaku berkat dinding sel yang mengandung selulosa, hemiselulosa, dan pektin. Dilengkapi kloroplas berklorofil untuk mengubah energi foton matahari menjadi glukosa melalui fotosintesis.',
    facts: [
      'Vakuola sentral pada sel tumbuhan dewasa dapat menempati hingga 90% volume total sel.',
      'Tekanan turgor cairan vakuola terhadap dinding sel adalah yang membuat batang tanaman herba tetap tegak berdiri tanpa tulang.',
      'Plasmodesmata adalah saluran mikroskopis penembus dinding sel yang menghubungkan sitoplasma sel tumbuhan bertetangga (jalur simplas).'
    ],
    keyMolecules: ['Klorofil a & b', 'Selulosa', 'Pektin', 'Rubisco', 'Amilum'],
    interactiveControls: {
      hasExplodeView: true
    },
    parts: [
      {
        id: 'dinding-sel',
        name: 'Dinding Sel (Cell Wall)',
        latinName: 'Paries cellularis',
        functionDesc: 'Lapisan luar kaku berbahan serat selulosa yang memberi bentuk tetap, sokongan mekanik, dan perlindungan dari lisis osmotik.',
        detail: 'Terdiri dari lamela tengah (berpektin pengikat antar-sel), dinding primer (fleksibel saat tumbuh), dan dinding sekunder (berlignin kayu).',
        clinicalNote: 'Kekurangan ion kalsium (Ca) menghambat pembentukan kalsium pektat pada lamela tengah dinding sel daun muda.',
        position: [1.4, 1.1, 0],
        color: '#15803d'
      },
      {
        id: 'kloroplas',
        name: 'Kloroplas (Organel Fotosintesis)',
        latinName: 'Chloroplastus',
        functionDesc: 'Organel plastida berisi klorofil yang menyerap foton cahaya untuk reaksi terang fotosintesis dan fiksasi CO2 pada Siklus Calvin.',
        detail: 'Memiliki tilakoid bertumpuk menjadi grana tempat reaksi terang fotosintesis, dikelilingi stroma cair tempat reaksi gelap.',
        clinicalNote: 'Klorosis (daun menguning akibat kloroplas gagal mensintesis klorofil) sering dipicu defisiensi magnesium atau nitrogen.',
        position: [-0.8, 0.7, 0.5],
        color: '#22c55e'
      },
      {
        id: 'vakuola-sentral',
        name: 'Vakuola Sentral Besar',
        latinName: 'Vacuola centralis',
        functionDesc: 'Kantung organel terbesar yang menampung getah sel (air, ion, pigmen antosianin, alkaloid pelindung) dan memelihara tekanan turgor.',
        detail: 'Dibatasi oleh membran semipermeabel bernama tonoplas yang memompa ion untuk menjaga kepekatan cairan vakuola.',
        clinicalNote: 'Plasmolisis terjadi ketika sel tumbuhan diletakkan di larutan hipertonik: air keluar vakuola hingga membran plasma terlepas dari dinding sel.',
        position: [0.1, -0.2, 0.2],
        color: '#06b6d4'
      },
      {
        id: 'nukleus-tumbuhan',
        name: 'Nukleus Sel Tumbuhan',
        latinName: 'Nucleus',
        functionDesc: 'Mengatur metabolisme seluler, pembelahan sel meristem, dan transkripsi gen-gen fotosintetik serta diferensiasi jaringan.',
        detail: 'Sering terdorong ke bagian tepi (perifer) sel tumbuhan akibat desakan volume vakuola sentral yang sangat besar.',
        clinicalNote: 'Polipoidi (penggandaan genom DNA inti) sering dimanfaatkan pada pemuliaan tanaman pertanian untuk menghasilkan buah tanpa biji.',
        position: [-0.9, -0.6, 0.4],
        color: '#8b5cf6'
      },
      {
        id: 'mitokondria-tumbuhan',
        name: 'Mitokondria Tumbuhan',
        latinName: 'Mitochondrion',
        functionDesc: 'Menghasilkan ATP melalui katabolisme glukosa (respirasi sel) saat malam hari maupun siang hari untuk metabolisme.',
        detail: 'Bekerja sinergis dengan kloroplas: kloroplas menghasilkan glukosa + O2, mitokondria memanfaatkannya menghasilkan ATP + CO2.',
        clinicalNote: 'Respirasi seluler tumbuhan tetap berlangsung 24 jam tanpa henti, tidak seperti fotosintesis yang memerlukan cahaya.',
        position: [0.9, -0.8, 0.5],
        color: '#f97316'
      }
    ]
  },
  {
    id: 'sel-neuron',
    name: 'Sel Saraf (Neuron)',
    category: 'sel',
    grade: '11',
    curriculumTopic: 'Sistem Koordinasi & Penghantaran Impuls Listrik',
    summary: 'Sel khusus penghantar impuls bioelektrik tubuh melalui depolarisasi potensial aksi sepanjang serabut akson.',
    description: 'Neuron memiliki percabangan dendrit yang menerima stimulus dari reseptor/neuron lain, badan sel (soma) pengolah sinyal, akson panjang penghantar impuls, selubung mielin isolator, dan terminal akson pelepas neurotransmiter di celah sinapsis.',
    facts: [
      'Penghantaran impuls melompati Nodus Ranvier (konduksi saltatori) melipatgandakan kecepatan transmisi hingga 120 meter per detik.',
      'Potensial istirahat membran neuron bernilai sekitar -70 mV akibat kerja aktif Pompa Natrium-Kalium (3 Na+ keluar, 2 K+ masuk).',
      'Neuron manusia dewasa berada dalam fase G0 siklus sel (amitosis) sehingga umumnya tidak dapat membelah lagi bila rusak berat.'
    ],
    keyMolecules: ['Asetilkolin', 'Neurotransmiter GABA', 'Ion Na+ & K+', 'Mielin Lipoprotein', 'SNARE Complex'],
    interactiveControls: {
      hasSignalFlow: true
    },
    parts: [
      {
        id: 'soma-dendrit',
        name: 'Badan Sel (Soma) & Dendrit',
        latinName: 'Corpus cellulare et Dendritum',
        functionDesc: 'Dendrit menerima stimulus reseptor; soma mengintegrasikan sinyal dan memuat nukleus serta Badan Nissl (RE kasar berdensitas tinggi).',
        detail: 'Akson hillock di pangkal badan sel adalah zona pemicu (trigger zone) yang menentukan apakah ambang batas depolarisasi tercapai untuk memicu potensial aksi.',
        clinicalNote: 'Badan Lewy (timbunan protein alfa-sinuklein abnormal di badan sel neuron) adalah patologi utama penyakit Parkinson.',
        position: [-1.4, 0.4, 0.1],
        color: '#3b82f6'
      },
      {
        id: 'akson-silinder',
        name: 'Akson (Neurit)',
        latinName: 'Axon',
        functionDesc: 'Serabut silindris panjang yang menghantarkan impuls listrik searah menjauhi badan sel menuju terminal efektor.',
        detail: 'Memiliki kanal ion bergerbang voltase (voltage-gated Na+ & K+ channels) yang membuka berurutan saat potensial aksi menjalar.',
        clinicalNote: 'Toksin ikan buntal (Tetrodotoksin/TTX) memblokir kanal Na+ akson sehingga neuron lumpuh menghantarkan impuls.',
        position: [0, 0, 0],
        color: '#a855f7'
      },
      {
        id: 'selubung-mielin',
        name: 'Selubung Mielin (Sel Schwann / Oligodendrosit)',
        latinName: 'Vagina myelini',
        functionDesc: 'Lapisan lemak konsentris yang bertindak sebagai isolator listrik mempercepat laju perambatan impuls impuls saraf.',
        detail: 'Dibentuk oleh Sel Schwann pada sistem saraf tepi (SST) dan oleh Oligodendrosit pada sistem saraf pusat (SSP).',
        clinicalNote: 'Sklerosis Ganda (Multiple Sclerosis) adalah penyakit autoimun di mana sistem imun merusak selubung mielin, memicu kelumpuhan motorik.',
        position: [0.2, 0.1, 0.2],
        color: '#eab308'
      },
      {
        id: 'nodus-ranvier',
        name: 'Nodus Ranvier',
        latinName: 'Nodus Ranvieri',
        functionDesc: 'Celah terbuka tanpa mielin tempat terjadinya depolarisasi loncatan impuls (konduksi saltatori).',
        detail: 'Memiliki konsentrasi kanal voltase Na+ tertinggi pada membran plasma akson.',
        clinicalNote: 'Tanpa nodus Ranvier dan mielin, kecepatan penghantaran impuls melambat dari 100 m/s menjadi hanya 1-2 m/s.',
        position: [-0.3, -0.05, 0.15],
        color: '#f97316'
      },
      {
        id: 'terminal-sinapsis',
        name: 'Terminal Akson & Sinapsis',
        latinName: 'Terminatio axonis et Synapsis',
        functionDesc: 'Ujung tombol akson yang melepaskan neurotransmiter dari vesikel sinaptik ke celah sinapsis menuju neuron pascasinaps.',
        detail: 'Masuknya ion kalsium (Ca2+) memicu fusi membran vesikel eksositosis neurotransmiter (asetilkolin, noradrenalin, dll.).',
        clinicalNote: 'Gas saraf insektisida organofosfat menghambat enzim asetilkolinesterase, menyebabkan penumpukan neurotransmiter di sinapsis.',
        position: [1.5, -0.4, 0.1],
        color: '#10b981'
      }
    ]
  },
  {
    id: 'sel-bakteri',
    name: 'Sel Bakteri (Prokariotik)',
    category: 'sel',
    grade: '10',
    curriculumTopic: 'Kingdom Monera & Struktur Sel Prokariotik',
    summary: 'Sel primitif tanpa membran inti sel (nukleus sejati), memiliki DNA sirkuler telanjang pada area nukleoid, dan dinding sel peptidoglikan.',
    description: 'Bakteri adalah organisme prokariotik uniseluler. Memiliki struktur permukaan berupa kapsul lendir pelindung, dinding sel (Gram positif berpeptidoglikan tebal vs Gram negatif berlipopolisakarida), membran plasma, ribosom 70S, plasmid cincin DNA, serta flagela untuk motilitas gerak.',
    facts: [
      'Plasmid bakteri membawa gen resistensi antibiotik yang dapat ditransfer antar-spesies melalui proses konjugasi via pilus seks.',
      'Dinding sel bakteri Gram positif mengikat kuat kristal violet berwarna ungu, sedangkan Gram negatif berwarna merah muda safranin.',
      'Bakteri dapat membentuk endospora berdinding tebal yang tahan panas dan radiasi saat kondisi lingkungan ekstrem tidak menguntungkan.'
    ],
    keyMolecules: ['Peptidoglikan', 'Lipopolisakarida (LPS)', 'DNA Sirkuler / Plasmid', 'Ribosom 70S', 'Flagelin'],
    interactiveControls: {
      hasExplodeView: true
    },
    parts: [
      {
        id: 'nukleoid-bakteri',
        name: 'Nukleoid (DNA Sirkuler Kromosomal)',
        latinName: 'Regio nucleoidea',
        functionDesc: 'Area sitoplasma tempat kromosom tunggal DNA sirkuler bakteri berada tanpa selubung membran inti karpoteka.',
        detail: 'DNA bakteri tidak berasosiasi padat dengan protein histon seperti sel eukariotik melainkan dikemas oleh protein nucleoid-associated.',
        clinicalNote: 'Antibiotik golongan kuinolon (seperti siprofloksasin) bekerja menghambat enzim DNA girase pada replikasi nukleoid bakteri.',
        position: [0, 0, 0.1],
        color: '#a855f7'
      },
      {
        id: 'dinding-sel-peptidoglikan',
        name: 'Dinding Sel Peptidoglikan',
        latinName: 'Paries cellularis bacterialis',
        functionDesc: 'Jejaring polimer gula N-asetilglukosamin (NAG) dan asam N-asetilmuramat (NAM) yang melindungi sel dari lisis osmotik.',
        detail: 'Gram-positif memiliki lapisan peptidoglikan sangat tebal (20-80 nm); Gram-negatif memiliki lapisan tipis diapit membran luar bermembran endotoksin LPS.',
        clinicalNote: 'Antibiotik penisilin bekerja dengan menghambat enzim transpeptidase yang merangkai ikatan silang peptidoglikan dinding sel.',
        position: [0.9, 0.4, 0.2],
        color: '#eab308'
      },
      {
        id: 'kapsul-glikokaliks',
        name: 'Kapsul Pelindung (Glikokaliks)',
        latinName: 'Capsula bacterialis',
        functionDesc: 'Lapisan lendir polisakarida di luar dinding sel yang melindungi bakteri patogen dari fagositosis sel darah putih inang.',
        detail: 'Juga berfungsi membantu bakteri menempel kuat pada substrat licin dan membentuk biofilm resisten.',
        clinicalNote: 'Bakteri Streptococcus pneumoniae berkapsul (Strain S) bersifat mematikan, sedangkan galur tanpa kapsul (Strain R) tidak virulen.',
        position: [1.2, -0.3, 0.3],
        color: '#06b6d4'
      },
      {
        id: 'flagela-bakteri',
        name: 'Flagela (Alat Gerak Cambuk)',
        latinName: 'Flagellum',
        functionDesc: 'Filamen heliks berputar tersusun dari protein flagelin yang digerakkan motor proton membran untuk kemotaksis gerak.',
        detail: 'Dapat berotasi searah maupun berlawanan jarum jam (run and tumble) menuju sumber nutrisi atau menjauhi toksin.',
        clinicalNote: 'Antigen H pada serotipe Salmonella atau E. coli merujuk pada variasi spesifik struktur protein flagela.',
        position: [-1.4, -0.6, 0.5],
        color: '#22c55e'
      },
      {
        id: 'ribosom-70s',
        name: 'Ribosom Prokariotik (70S)',
        latinName: 'Ribosoma 70S',
        functionDesc: 'Mesin translasi sintesis protein bakteri tersusun atas subunit kecil 30S dan subunit besar 50S.',
        detail: 'Perbedaan struktur ribosom 70S prokariotik dan ribosom 80S eukariotik menjadi target terapi selektif obat antibiotik.',
        clinicalNote: 'Antibiotik tetrasiklin dan kloramfenikol membunuh bakteri dengan mengikat subunit ribosom 30S dan 50S secara selektif tanpa meracuni ribosom manusia.',
        position: [-0.5, 0.6, 0.3],
        color: '#ef4444'
      }
    ]
  }
];
