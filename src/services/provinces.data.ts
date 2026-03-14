// src/services/provinces.data.ts

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface Tradition {
  name: string;
  image: string;
  desc: string;
  philosophy: string;
  gallery: string[];
}

export interface ProvinceData {
  id: string;
  name: string;
  capital: string;
  region: string; // Kelompok Pulau (Sumatra, Jawa, Bali-Nusa, Kalimantan, Sulawesi, Maluku-Papua)
  summary: string;
  image: string; // Image untuk Sejarah/Provinsi
  timeline: TimelineItem[];
  tradition: Tradition; // Gabungan data tradisi
}

// =============================================================================
// CATATAN PEMETAAN ID → GeoJSON Propinsi
// =============================================================================
// Normalisasi: huruf kecil, spasi → tanda hubung, hapus karakter khusus
//
// 'di-aceh'                      ← "DI. ACEH"
// 'sumatera-utara'               ← "SUMATERA UTARA"
// 'sumatera-barat'               ← "SUMATERA BARAT"
// 'riau'                         ← "RIAU"
// 'kepulauan-riau'               ← (tidak ada di GeoJSON sample, perlu disesuaikan)
// 'jambi'                        ← "JAMBI"
// 'sumatera-selatan'             ← "SUMATERA SELATAN"
// 'bangka-belitung'              ← "BANGKA BELITUNG"
// 'bengkulu'                     ← "BENGKULU"
// 'lampung'                      ← "LAMPUNG"
// 'probanten'                    ← "PROBANTEN" (Banten)
// 'dki-jakarta'                  ← "DKI JAKARTA"
// 'jawa-barat'                   ← "JAWA BARAT"
// 'jawa-tengah'                  ← "JAWA TENGAH"
// 'daerah-istimewa-yogyakarta'   ← "DAERAH ISTIMEWA YOGYAKARTA"
// 'jawa-timur'                   ← "JAWA TIMUR"
// 'bali'                         ← "BALI"
// 'nusa-tenggara-barat'          ← "NUSA TENGGARA BARAT"
// 'nusa-tenggara-timur'          ← "NUSA TENGGARA TIMUR"
// 'kalimantan-barat'             ← "KALIMANTAN BARAT"
// 'kalimantan-tengah'            ← "KALIMANTAN TENGAH"
// 'kalimantan-selatan'           ← "KALIMANTAN SELATAN"
// 'kalimantan-timur'             ← "KALIMANTAN TIMUR"
// 'kalimantan-utara'             ← (tidak ada di GeoJSON sample, perlu disesuaikan)
// 'sulawesi-utara'               ← "SULAWESI UTARA"
// 'gorontalo'                    ← "GORONTALO"
// 'sulawesi-tengah'              ← "SULAWESI TENGAH"
// 'sulawesi-barat'               ← (tidak ada di GeoJSON sample, perlu disesuaikan)
// 'sulawesi-selatan'             ← "SULAWESI SELATAN"
// 'sulawesi-tenggara'            ← "SULAWESI TENGGARA"
// 'maluku'                       ← "MALUKU"
// 'maluku-utara'                 ← "MALUKU UTARA"
// 'irian-jaya-timur'             ← "IRIAN JAYA TIMUR" (Papua)
// 'irian-jaya-barat'             ← "IRIAN JAYA BARAT" (Papua Barat)
// 'papua-selatan'                ← (tidak ada di GeoJSON sample, perlu disesuaikan)
// 'irian-jaya-tengah'            ← "IRIAN JAYA TENGAH" (Papua Tengah)
// 'papua-pegunungan'             ← (tidak ada di GeoJSON sample, perlu disesuaikan)
// 'papua-barat-daya'             ← (tidak ada di GeoJSON sample, perlu disesuaikan)
// =============================================================================

export const provinces: ProvinceData[] = [
  // --- SUMATRA (10 Provinsi) ---
  {
    id: 'di-aceh', // GeoJSON: "DI. ACEH" → normalisasi: "di-aceh"
    name: 'Nanggroe Aceh Darussalam',
    capital: 'Banda Aceh',
    region: 'Sumatra',
    summary: 'Dikenal sebagai Serambi Mekkah, Aceh merupakan lokasi kerajaan Islam pertama di Nusantara dan wilayah yang memiliki otonomi khusus.',
    image: '/images/provinces/aceh.jpg',
    timeline: [
      { year: '1267', title: 'Kesultanan Samudera Pasai', description: 'Kerajaan Islam pertama di Indonesia didirikan oleh Sultan Malik Al-Saleh.' },
      { year: '1607', title: 'Masa Keemasan Sultan Iskandar Muda', description: 'Aceh menjadi pusat perdagangan internasional dan kekuatan militer yang disegani.' },
      { year: '2005', title: 'MoU Helsinki', description: 'Penandatanganan perdamaian antara RI dan GAM pasca-tsunami 2004.' }
    ],
    tradition: {
      name: 'Peusijuek',
      image: '/images/tradition/peusijuek.jpg',
      desc: 'Upacara adat Aceh yang dilakukan pada berbagai peristiwa penting seperti pernikahan dan menempati rumah baru.',
      philosophy: 'Ungkapan rasa syukur, doa keselamatan, dan harapan akan keberkahan hidup.',
      gallery: ['/images/tradition/peusijuek.jpg']
    }
  },
  {
    id: 'sumatera-utara', // GeoJSON: "SUMATERA UTARA" → normalisasi: "sumatera-utara"
    name: 'Sumatera Utara',
    capital: 'Medan',
    region: 'Sumatra',
    summary: 'Wilayah heterogen yang menjadi rumah bagi peradaban Batak kuno dan kejayaan perkebunan tembakau Deli.',
    image: '/images/provinces/sumatera-utara.jpg',
    timeline: [
      { year: '1863', title: 'Lahirnya Perkebunan Deli', description: 'Jacob Nienhuys mendirikan Deli Maatschappij, pusat ekonomi tembakau dunia.' },
      { year: '1948', title: 'Pembentukan Provinsi', description: 'Resmi dibentuk berdasarkan UU No. 10 Tahun 1948.' }
    ],
    tradition: {
      name: 'Lompat Batu (Hombo Batu)',
      image: '/images/tradition/lompat-batu-hombo-batu.jpg',
      desc: 'Tradisi masyarakat Nias Selatan untuk menandai kedewasaan seorang pemuda.',
      philosophy: 'Keberanian, kekuatan, dan kesiapan menjaga masyarakat.',
      gallery: ['/images/tradition/lompat-batu-hombo-batu.jpg']
    }
  },
  {
    id: 'sumatera-barat', // GeoJSON: "SUMATERA BARAT" → normalisasi: "sumatera-barat"
    name: 'Sumatera Barat',
    capital: 'Padang',
    region: 'Sumatra',
    summary: 'Tanah kelahiran budaya Minangkabau yang menganut sistem matrilineal dan menjadi pusat intelektual tokoh bangsa.',
    image: '/images/provinces/sumatera-barat.jpg',
    timeline: [
      { year: '1347', title: 'Kerajaan Pagaruyung', description: 'Adityawarman mendirikan kerajaan di pedalaman Minangkabau.' },
      { year: '1821', title: 'Perang Padri', description: 'Konflik antara Kaum Padri dan Kaum Adat melawan Belanda.' }
    ],
    tradition: {
      name: 'Pesta Tabuik',
      image: '/images/tradition/pesta-tabuik.jpg',
      desc: 'Upacara adat Pariaman untuk mengenang peristiwa sejarah Islam (Asyura).',
      philosophy: 'Nilai religius, penghormatan sejarah, dan semangat kebersamaan.',
      gallery: ['/images/tradition/pesta-tabuik.jpg']
    }
  },
  {
    id: 'riau', // GeoJSON: "RIAU" → normalisasi: "riau"
    name: 'Riau',
    capital: 'Pekanbaru',
    region: 'Sumatra',
    summary: 'Pusat kebudayaan Melayu Nusantara dan salah satu provinsi terkaya dengan cadangan minyak bumi.',
    image: '/images/provinces/riau.jpg',
    timeline: [
      { year: '1723', title: 'Kesultanan Siak Sri Indrapura', description: 'Didirikan oleh Raja Kecil, menjadi kekuatan maritim di Selat Malaka.' }
    ],
    tradition: {
      name: 'Bakar Tongkang',
      image: '/images/tradition/bakar-tongkang.jpg',
      desc: 'Festival masyarakat Tionghoa Bagan Siapiapi sebagai simbol tekad untuk menetap di tanah baru.',
      philosophy: 'Rasa syukur kepada dewa laut dan penghormatan terhadap leluhur.',
      gallery: ['/images/tradition/bakar-tongkang.jpg']
    }
  },
  {
    id: 'kepulauan-riau', // GeoJSON: tidak ada entry terpisah di sample — sesuaikan jika ada
    name: 'Kepulauan Riau',
    capital: 'Tanjung Pinang',
    region: 'Sumatra',
    summary: 'Tempat lahirnya standarisasi bahasa Melayu Tinggi yang menjadi cikal bakal Bahasa Indonesia.',
    image: '/images/provinces/kepulauan-riau.jpg',
    timeline: [
      { year: '1808', title: 'Masa Kejayaan Pulau Penyengat', description: 'Pusat pemerintahan dan budaya Kesultanan Riau-Lingga.' }
    ],
    tradition: {
      name: 'Tepuk Tepung Tawar',
      image: '/images/tradition/tepuk-tepung-tawar.jpg',
      desc: 'Ritual adat Melayu sebagai bentuk syukur atau pemberian selamat.',
      philosophy: 'Pembersihan diri dari keburukan dan doa untuk kesucian niat.',
      gallery: ['/images/tradition/tepuk-tepung-tawar.jpg']
    }
  },
  {
    id: 'jambi', // GeoJSON: "JAMBI" → normalisasi: "jambi"
    name: 'Jambi',
    capital: 'Jambi',
    region: 'Sumatra',
    summary: 'Rumah bagi Situs Percandian Muaro Jambi, kompleks candi peninggalan Kerajaan Melayu dan Sriwijaya.',
    image: '/images/provinces/jambi.jpg',
    timeline: [
      { year: 'Abad 7', title: 'Kerajaan Melayu', description: 'Jambi muncul sebagai pusat perdagangan dan penyebaran agama Buddha.' }
    ],
    tradition: {
      name: 'Berserambahan',
      image: '/images/tradition/berserambahan.jpg',
      desc: 'Prosesi adat lamaran yang melibatkan adu pantun dan peragaan silat.',
      philosophy: 'Menjunjung tinggi kesantunan, musyawarah, dan keterbukaan keluarga.',
      gallery: ['/images/tradition/berserambahan.jpg']
    }
  },
  {
    id: 'sumatera-selatan', // GeoJSON: "SUMATERA SELATAN" → normalisasi: "sumatera-selatan"
    name: 'Sumatera Selatan',
    capital: 'Palembang',
    region: 'Sumatra',
    summary: 'Pusat Kemaharajaan Sriwijaya yang pernah menguasai jalur maritim perdagangan Asia Tenggara.',
    image: '/images/provinces/sumatera-selatan.jpg',
    timeline: [
      { year: 'Abad 7', title: 'Kejayaan Sriwijaya', description: 'Palembang menjadi pusat pemerintahan kemaharajaan maritim terbesar.' }
    ],
    tradition: {
      name: 'Sedekah Rame',
      image: '/images/tradition/sedekah-rame.jpg',
      desc: 'Upacara adat petani tradisional untuk memohon kelancaran panen dan perlindungan.',
      philosophy: 'Keseimbangan antara aktivitas manusia dengan alam semesta.',
      gallery: ['/images/tradition/sedekah-rame.jpg']
    }
  },
  {
    id: 'bangka-belitung', // GeoJSON: "BANGKA BELITUNG" → normalisasi: "bangka-belitung"
    name: 'Bangka Belitung',
    capital: 'Pangkal Pinang',
    region: 'Sumatra',
    summary: 'Penghasil timah terbesar di dunia sejak zaman kolonial dan dikenal karena keindahan pantai granitnya.',
    image: '/images/provinces/bangka-belitung.jpg',
    timeline: [
      { year: '1710', title: 'Penambangan Timah Pertama', description: 'Eksplorasi timah pertama kali dilakukan oleh Kesultanan Palembang.' }
    ],
    tradition: {
      name: 'Buang Jong',
      image: '/images/tradition/buang-jong.jpg',
      desc: 'Tradisi suku Sawang membuang miniatur kapal ke laut sebagai persembahan.',
      philosophy: 'Penghormatan terhadap laut sebagai sumber kehidupan masyarakat.',
      gallery: ['/images/tradition/buang-jong.jpg']
    }
  },
  {
    id: 'bengkulu', // GeoJSON: "BENGKULU" → normalisasi: "bengkulu"
    name: 'Bengkulu',
    capital: 'Bengkulu',
    region: 'Sumatra',
    summary: 'Wilayah yang pernah menjadi koloni Inggris (Bencoolen) dan tempat pengasingan Presiden Soekarno.',
    image: '/images/provinces/bengkulu.jpg',
    timeline: [
      { year: '1714', title: 'Benteng Marlborough', description: 'Inggris membangun benteng pertahanan terkuat mereka di Asia Tenggara.' }
    ],
    tradition: {
      name: 'Festival Tabot',
      image: '/images/tradition/tabot.jpg',
      desc: 'Upacara mengenang heroisme Husein bin Ali yang diadaptasi menjadi budaya lokal.',
      philosophy: 'Keteguhan memegang prinsip dan pelestarian sejarah religi.',
      gallery: ['/images/tradition/tabot.jpg']
    }
  },
  {
    id: 'lampung', // GeoJSON: "LAMPUNG" → normalisasi: "lampung"
    name: 'Lampung',
    capital: 'Bandar Lampung',
    region: 'Sumatra',
    summary: 'Pintu gerbang Pulau Sumatra yang secara historis dikenal sebagai pusat perdagangan lada hitam.',
    image: '/images/provinces/lampung.jpg',
    timeline: [
      { year: '1883', title: 'Letusan Krakatau', description: 'Letusan dahsyat yang mengubah kondisi geografis pesisir Lampung.' }
    ],
    tradition: {
      name: 'Cakak Pepadun',
      image: '/images/tradition/cakak-pepadun.jpg',
      desc: 'Upacara kenaikan status adat bagi masyarakat Lampung Pepadun.',
      philosophy: 'Tanggung jawab sosial, martabat, dan kepemimpinan yang bijaksana.',
      gallery: ['/images/tradition/cakak-pepadun.jpg']
    }
  },

  // --- JAWA (6 Provinsi) ---
  {
    id: 'probanten', // GeoJSON: "PROBANTEN" → normalisasi: "probanten"
    name: 'Banten',
    capital: 'Serang',
    region: 'Jawa',
    summary: 'Eks kesultanan Islam maritim yang pernah menjadi pusat perdagangan lada internasional.',
    image: '/images/provinces/banten.jpg',
    timeline: [
      { year: '1526', title: 'Kesultanan Banten', description: 'Syarif Hidayatullah mendirikan kekuasaan Islam di Banten Girang.' }
    ],
    tradition: {
      name: 'Kawalu',
      image: '/images/tradition/kawalu.jpg',
      desc: 'Upacara adat suku Baduy berupa puasa tiga bulan untuk mensyukuri hasil bumi.',
      philosophy: 'Pembersihan diri, kesederhanaan, dan ketaatan total pada adat leluhur.',
      gallery: ['/images/tradition/kawalu.jpg']
    }
  },
  {
    id: 'dki-jakarta', // GeoJSON: "DKI JAKARTA" → normalisasi: "dki-jakarta"
    name: 'DKI Jakarta',
    capital: 'Jakarta',
    region: 'Jawa',
    summary: 'Pusat gravitasi ekonomi Indonesia yang berkembang dari pelabuhan kuno Sunda Kelapa.',
    image: '/images/provinces/dki-jakarta.jpg',
    timeline: [
      { year: '1527', title: 'Kemenangan Fatahillah', description: 'Pengubahan nama Sunda Kelapa menjadi Jayakarta (Kota Kemenangan).' }
    ],
    tradition: {
      name: 'Nujuh Bulan',
      image: '/images/tradition/nujuh-bulan.jpg',
      desc: 'Ritual syukuran kehamilan tujuh bulan bagi masyarakat Betawi.',
      philosophy: 'Doa memohon keselamatan untuk ibu dan calon bayi agar berbudi pekerti luhur.',
      gallery: ['/images/tradition/nujuh-bulan.jpg']
    }
  },
  {
    id: 'jawa-barat', // GeoJSON: "JAWA BARAT" → normalisasi: "jawa-barat"
    name: 'Jawa Barat',
    capital: 'Bandung',
    region: 'Jawa',
    summary: 'Tanah Pasundan yang kaya akan sejarah kerajaan agraris dan budaya literasi Sunda.',
    image: '/images/provinces/jawa-barat.jpg',
    timeline: [
      { year: 'Abad 4', title: 'Kerajaan Tarumanegara', description: 'Kerajaan bercorak Hindu tertua di Jawa.' }
    ],
    tradition: {
      name: 'Ngeuyeuk Seureuh',
      image: '/images/tradition/ngeuyeuk-seureuh.jpg',
      desc: 'Upacara pra-nikah Sunda di mana orang tua memberi nasihat melalui simbol-simbol benda.',
      philosophy: 'Kesiapan batin dan keharmonisan dalam membangun rumah tangga.',
      gallery: ['/images/tradition/ngeuyeuk-seureuh.jpg']
    }
  },
  {
    id: 'jawa-tengah', // GeoJSON: "JAWA TENGAH" → normalisasi: "jawa-tengah"
    name: 'Jawa Tengah',
    capital: 'Semarang',
    region: 'Jawa',
    summary: 'Jantung peradaban Jawa, rumah bagi Borobudur dan sisa-sisa kemegahan Mataram Kuno.',
    image: '/images/provinces/jawa-tengah.jpg',
    timeline: [
      { year: 'Abad 8', title: 'Dinasti Syailendra', description: 'Pembangunan Candi Borobudur sebagai pusat agama Buddha.' }
    ],
    tradition: {
      name: 'Merti Desa',
      image: '/images/tradition/merti-desa.jpg',
      desc: 'Tradisi bersih desa dan sedekah bumi sebagai wujud syukur panen.',
      philosophy: 'Kerukunan antarwarga dan kesadaran akan keberlanjutan alam.',
      gallery: ['/images/tradition/merti-desa.jpg']
    }
  },
  {
    id: 'daerah-istimewa-yogyakarta', // GeoJSON: "DAERAH ISTIMEWA YOGYAKARTA" → normalisasi: "daerah-istimewa-yogyakarta"
    name: 'Daerah Istimewa Yogyakarta',
    capital: 'Yogyakarta',
    region: 'Jawa',
    summary: 'Daerah istimewa yang mempertahankan sistem kesultanan dan menjadi pusat pelestarian budaya Jawa.',
    image: '/images/provinces/di-yogyakarta.jpg',
    timeline: [
      { year: '1755', title: 'Perjanjian Giyanti', description: 'Lahirnya Kasultanan Ngayogyakarta Hadiningrat.' }
    ],
    tradition: {
      name: 'Sekaten',
      image: '/images/tradition/sekaten.jpg',
      desc: 'Upacara memperingati Maulid Nabi Muhammad SAW dengan bunyi gamelan kyai sekati.',
      philosophy: 'Harmonisasi antara ajaran Islam dengan kearifan lokal Jawa.',
      gallery: ['/images/tradition/sekaten.jpg']
    }
  },
  {
    id: 'jawa-timur', // GeoJSON: "JAWA TIMUR" → normalisasi: "jawa-timur"
    name: 'Jawa Timur',
    capital: 'Surabaya',
    region: 'Jawa',
    summary: 'Tanah asal Imperium Majapahit yang menjadi cikal bakal konsep Nusantara.',
    image: '/images/provinces/jawa-timur.jpg',
    timeline: [
      { year: '1293', title: 'Berdirinya Majapahit', description: 'Raden Wijaya mendirikan kerajaan yang menyatukan wilayah luas.' }
    ],
    tradition: {
      name: 'Yadnya Kasada',
      image: '/images/tradition/kasodo.jpg',
      desc: 'Ritual kurban masyarakat Tengger di kawah Gunung Bromo.',
      philosophy: 'Pengorbanan, syukur, dan penghormatan kepada leluhur (Eyang Kusuma).',
      gallery: ['/images/tradition/kasodo.jpg']
    }
  },

  // --- BALI & NUSA TENGGARA (3 Provinsi) ---
  {
    id: 'bali', // GeoJSON: "BALI" → normalisasi: "bali"
    name: 'Bali',
    capital: 'Denpasar',
    region: 'Bali-Nusa',
    summary: 'Pulau Dewata yang dikenal karena keteguhannya menjaga harmoni antara manusia, alam, dan Tuhan.',
    image: '/images/provinces/bali.jpg',
    timeline: [
      { year: '1343', title: 'Ekspedisi Gajah Mada', description: 'Penaklukan Bali oleh Majapahit membawa pengaruh besar pada seni dan agama.' }
    ],
    tradition: {
      name: 'Melasti',
      image: '/images/tradition/melasti.jpg',
      desc: 'Ritual penyucian benda sakral dan diri ke sumber air (laut/danau) menjelang Nyepi.',
      philosophy: 'Penghanyutan kotoran alam semesta (Bhuana Agung) dan diri (Bhuana Alit).',
      gallery: ['/images/tradition/melasti.jpg']
    }
  },
  {
    id: 'nusa-tenggara-barat', // GeoJSON: "NUSA TENGGARA BARAT" → normalisasi: "nusa-tenggara-barat"
    name: 'Nusa Tenggara Barat',
    capital: 'Mataram',
    region: 'Bali-Nusa',
    summary: 'Provinsi yang terdiri dari Pulau Lombok dan Sumbawa, rumah bagi Gunung Rinjani.',
    image: '/images/provinces/nusa-tenggara-barat.jpg',
    timeline: [
      { year: '1815', title: 'Erupsi Tambora', description: 'Letusan gunung api terbesar dalam catatan sejarah manusia.' }
    ],
    tradition: {
      name: 'Bau Nyale',
      image: '/images/tradition/penangkapan-ikan-nyale.jpg',
      desc: 'Tradisi berburu cacing laut yang dipercaya sebagai jelmaan Putri Mandalika.',
      philosophy: 'Pengorbanan diri untuk kepentingan orang banyak dan kebersamaan.',
      gallery: ['/images/tradition/penangkapan-ikan-nyale.jpg']
    }
  },
  {
    id: 'nusa-tenggara-timur', // GeoJSON: "NUSA TENGGARA TIMUR" → normalisasi: "nusa-tenggara-timur"
    name: 'Nusa Tenggara Timur',
    capital: 'Kupang',
    region: 'Bali-Nusa',
    summary: 'Provinsi kepulauan dengan keragaman etnis yang sangat tinggi dan sejarah cendana yang masyhur.',
    image: '/images/provinces/nusa-tenggara-timur.jpg',
    timeline: [
      { year: '1556', title: 'Misi Portugis', description: 'Awal pengaruh budaya Katolik dan kedatangan bangsa Eropa untuk perdagangan kayu cendana.' }
    ],
    tradition: {
      name: 'Reba',
      image: '/images/tradition/reba.jpg',
      desc: 'Upacara penghormatan ubi kayu (ubi Reba) sebagai sumber pangan sakral suku Ngada.',
      philosophy: 'Refleksi terhadap asal-usul kehidupan dan rasa syukur atas ketahanan pangan.',
      gallery: ['/images/tradition/reba.jpg']
    }
  },

  // --- KALIMANTAN (5 Provinsi) ---
  {
    id: 'kalimantan-barat', // GeoJSON: "KALIMANTAN BARAT" → normalisasi: "kalimantan-barat"
    name: 'Kalimantan Barat',
    capital: 'Pontianak',
    region: 'Kalimantan',
    summary: 'Dilalui garis khatulistiwa dan dikenal sebagai wilayah dengan populasi multikultural Dayak, Melayu, dan Tionghoa.',
    image: '/images/provinces/kalimantan-barat.jpg',
    timeline: [
      { year: '1771', title: 'Pendirian Pontianak', description: 'Syarif Abdurrahman Alkadrie membangun kesultanan di percabangan sungai.' }
    ],
    tradition: {
      name: 'Naik Dango',
      image: '/images/tradition/naik-dango.jpg',
      desc: 'Pesta syukur panen padi masyarakat Dayak Kanayatn.',
      philosophy: 'Menghormati Sang Hyang Dewata (Tuhan) atas kelimpahan rezeki.',
      gallery: ['/images/tradition/naik-dango.jpg']
    }
  },
  {
    id: 'kalimantan-tengah', // GeoJSON: "KALIMANTAN TENGAH" → normalisasi: "kalimantan-tengah"
    name: 'Kalimantan Tengah',
    capital: 'Palangkaraya',
    region: 'Kalimantan',
    summary: 'Wilayah yang memfokuskan pelestarian hutan tropis dan budaya Dayak Ngaju.',
    image: '/images/provinces/kalimantan-tengah.jpg',
    timeline: [
      { year: '1957', title: 'Pembentukan Provinsi', description: 'Resmi berdiri sebagai bentuk aspirasi masyarakat Dayak.' }
    ],
    tradition: {
      name: 'Tiwah',
      image: '/images/tradition/maniring-hinting.jpg',
      desc: 'Upacara pengantaran tulang belulang leluhur ke rumah kecil yang disebut Sandung.',
      philosophy: 'Penyempurnaan perjalanan roh menuju Lewu Tatau (Surga).',
      gallery: ['/images/tradition/maniring-hinting.jpg']
    }
  },
  {
    id: 'kalimantan-selatan', // GeoJSON: "KALIMANTAN SELATAN" → normalisasi: "kalimantan-selatan"
    name: 'Kalimantan Selatan',
    capital: 'Banjarbaru',
    region: 'Kalimantan',
    summary: 'Pusat budaya sungai dengan sejarah perlawanan heroik Pangeran Antasari dalam Perang Banjar.',
    image: '/images/provinces/kalimantan-selatan.jpg',
    timeline: [
      { year: '1526', title: 'Sultan Suriansyah', description: 'Masuknya pengaruh Islam dan berdirinya Kesultanan Banjar.' }
    ],
    tradition: {
      name: 'Aruh Baharin',
      image: '/images/tradition/aruh-ganal.jpg',
      desc: 'Upacara syukuran besar suku Dayak Meratus setelah musim panen.',
      philosophy: 'Kebersamaan dan penghormatan terhadap roh-roh penjaga alam.',
      gallery: ['/images/tradition/aruh-ganal.jpg']
    }
  },
  {
    id: 'kalimantan-timur', // GeoJSON: "KALIMANTAN TIMUR" → normalisasi: "kalimantan-timur"
    name: 'Kalimantan Timur',
    capital: 'Samarinda',
    region: 'Kalimantan',
    summary: 'Wilayah yang menampung bukti peradaban tulisan tertua di Indonesia dan lokasi Ibu Kota Nusantara.',
    image: '/images/provinces/kalimantan-timur.jpg',
    timeline: [
      { year: 'Abad 4', title: 'Kerajaan Kutai', description: 'Prasasti Yupa membuktikan berdirinya kerajaan Hindu tertua.' }
    ],
    tradition: {
      name: 'Lom Plai',
      image: '/images/tradition/mecaq-undat.jpg',
      desc: 'Ritual pesta panen Dayak Wehea untuk menghormati Dewi Padi.',
      philosophy: 'Siklus hidup dan rasa hormat kepada pengorbanan leluhur.',
      gallery: ['/images/tradition/mecaq-undat.jpg']
    }
  },
  {
    id: 'kalimantan-utara', // GeoJSON: tidak ada di sample — sesuaikan jika data tersedia
    name: 'Kalimantan Utara',
    capital: 'Tanjung Selor',
    region: 'Kalimantan',
    summary: 'Provinsi termuda di Kalimantan yang memiliki akar sejarah dari Kesultanan Bulungan.',
    image: '/images/provinces/kalimantan-utara.jpg',
    timeline: [
      { year: '2012', title: 'Otonomi Daerah', description: 'Resmi mekar dari Kalimantan Timur sebagai provinsi ke-34.' }
    ],
    tradition: {
      name: 'Iraw Tengkayu',
      image: '/images/tradition/iraw-tengkayu.jpg',
      desc: 'Parade perahu hias dan pelarungan sesaji di laut oleh suku Tidung.',
      philosophy: 'Pelestarian identitas suku air dan rasa syukur pada sang pencipta.',
      gallery: ['/images/tradition/iraw-tengkayu.jpg']
    }
  },

  // --- SULAWESI (6 Provinsi) ---
  {
    id: 'sulawesi-utara', // GeoJSON: "SULAWESI UTARA" → normalisasi: "sulawesi-utara"
    name: 'Sulawesi Utara',
    capital: 'Manado',
    region: 'Sulawesi',
    summary: 'Bumi Nyiur Melambai yang kental dengan pengaruh kolonial Belanda dan semangat inklusifitas.',
    image: '/images/provinces/sulawesi-utara.jpg',
    timeline: [
      { year: '1679', title: 'Aliansi Minahasa-VOC', description: 'Perjanjian kerja sama untuk melawan dominasi Spanyol.' }
    ],
    tradition: {
      name: 'Tulude',
      image: '/images/tradition/naik-rumah-baru.jpg',
      desc: 'Upacara adat suku Sangihe untuk melepas tahun lama dan menyambut tahun baru.',
      philosophy: 'Pembersihan kesalahan masa lalu dan persiapan diri menghadapi masa depan.',
      gallery: ['/images/tradition/naik-rumah-baru.jpg']
    }
  },
  {
    id: 'gorontalo', // GeoJSON: "GORONTALO" → normalisasi: "gorontalo"
    name: 'Gorontalo',
    capital: 'Gorontalo',
    region: 'Sulawesi',
    summary: 'Provinsi yang memproklamasikan kemerdekaannya sendiri pada 23 Januari 1942 sebelum proklamasi nasional.',
    image: '/images/provinces/gorontalo.jpg',
    timeline: [
      { year: '1942', title: 'Peristiwa 23 Januari', description: 'Nani Wartabone membebaskan Gorontalo dari penjajah Belanda.' }
    ],
    tradition: {
      name: 'Dikili',
      image: '/images/tradition/molonthalo.jpg',
      desc: 'Tradisi zikir dan selawat sepanjang malam untuk merayakan Maulid Nabi.',
      philosophy: 'Keteguhan dalam iman dan kecintaan pada nilai-nilai religi.',
      gallery: ['/images/tradition/molonthalo.jpg']
    }
  },
  {
    id: 'sulawesi-tengah', // GeoJSON: "SULAWESI TENGAH" → normalisasi: "sulawesi-tengah"
    name: 'Sulawesi Tengah',
    capital: 'Palu',
    region: 'Sulawesi',
    summary: 'Wilayah dengan koleksi patung batu megalitikum yang tersebar di Lembah Bada dan Lore.',
    image: '/images/provinces/sulawesi-tengah.jpg',
    timeline: [
      { year: 'Abad 11', title: 'Era Megalitikum', description: 'Puncak peradaban batu besar di Sulawesi bagian tengah.' }
    ],
    tradition: {
      name: 'Vunja',
      image: '/images/tradition/no-balia.jpg',
      desc: 'Upacara syukur atas hasil panen padi bagi suku Kaili.',
      philosophy: 'Kedaulatan pangan dan menjaga restu alam.',
      gallery: ['/images/tradition/no-balia.jpg']
    }
  },
  {
    id: 'sulawesi-barat', // GeoJSON: tidak ada di sample — sesuaikan jika data tersedia
    name: 'Sulawesi Barat',
    capital: 'Mamuju',
    region: 'Sulawesi',
    summary: 'Tanah suku Mandar yang melahirkan tradisi pelaut ulung perahu Sandeq.',
    image: '/images/provinces/sulawesi-barat.jpg',
    timeline: [
      { year: '2004', title: 'Pemekaran Wilayah', description: 'Mekar dari Sulawesi Selatan demi pemerataan pembangunan.' }
    ],
    tradition: {
      name: "Sayyang Pattu'du",
      image: '/images/tradition/mokkufiwa-lopi.jpg',
      desc: "Tradisi kuda menari untuk merayakan anak yang telah khatam Al-Qur'an.",
      philosophy: 'Apresiasi terhadap pencapaian spiritual dan pendidikan anak.',
      gallery: ['/images/tradition/mokkufiwa-lopi.jpg']
    }
  },
  {
    id: 'sulawesi-selatan', // GeoJSON: "SULAWESI SELATAN" → normalisasi: "sulawesi-selatan"
    name: 'Sulawesi Selatan',
    capital: 'Makassar',
    region: 'Sulawesi',
    summary: 'Pusat kejayaan maritim Kesultanan Gowa dan rumah bagi suku Bugis, Makassar, serta Toraja.',
    image: '/images/provinces/sulawesi-selatan.jpg',
    timeline: [
      { year: '1667', title: 'Perjanjian Bungaya', description: 'Konflik besar antara Kesultanan Gowa dan VOC Belanda.' }
    ],
    tradition: {
      name: 'Rambu Solo',
      image: '/images/tradition/accera-kalompoang.jpg',
      desc: 'Upacara pemakaman adat Toraja yang sangat megah dan sakral.',
      philosophy: 'Penghormatan terakhir kepada orang tua dan pengantar arwah ke alam baka.',
      gallery: ['/images/tradition/accera-kalompoang.jpg']
    }
  },
  {
    id: 'sulawesi-tenggara', // GeoJSON: "SULAWESI TENGGARA" → normalisasi: "sulawesi-tenggara"
    name: 'Sulawesi Tenggara',
    capital: 'Kendari',
    region: 'Sulawesi',
    summary: 'Wilayah Kesultanan Buton yang pernah memiliki hukum tata negara paling maju di zamannya.',
    image: '/images/provinces/sulawesi-tenggara.jpg',
    timeline: [
      { year: '1542', title: 'Kesultanan Buton', description: 'Sistem monarki konstitusional di mana Sultan dapat diberhentikan oleh dewan.' }
    ],
    tradition: {
      name: 'Karia',
      image: '/images/tradition/rambu-solo.jpg',
      desc: 'Upacara pingitan bagi gadis suku Muna dan Buton yang menginjak usia dewasa.',
      philosophy: 'Pemberian bekal moral, kesucian, dan etika hidup sebagai wanita dewasa.',
      gallery: ['/images/tradition/rambu-solo.jpg']
    }
  },

  // --- MALUKU & PAPUA (8 Provinsi) ---
  {
    id: 'maluku', // GeoJSON: "MALUKU" → normalisasi: "maluku"
    name: 'Maluku',
    capital: 'Ambon',
    region: 'Maluku-Papua',
    summary: 'Dikenal sebagai Kepulauan Rempah-Rempah yang mengubah sejarah ekonomi dunia pada abad pertengahan.',
    image: '/images/provinces/maluku.jpg',
    timeline: [
      { year: '1512', title: 'Kedatangan Bangsa Eropa', description: 'Portugis menjadi bangsa Eropa pertama yang mendarat di Maluku untuk cengkeh.' }
    ],
    tradition: {
      name: 'Pukul Sapu',
      image: '/images/tradition/suu-anaku.jpg',
      desc: 'Atraksi saling cambuk menggunakan lidi pohon enau di Desa Mamala dan Morella.',
      philosophy: 'Menjaga persaudaraan dan menguji ketahanan fisik pasca-Ramadan.',
      gallery: ['/images/tradition/suu-anaku.jpg']
    }
  },
  {
    id: 'maluku-utara', // GeoJSON: "MALUKU UTARA" → normalisasi: "maluku-utara"
    name: 'Maluku Utara',
    capital: 'Sofifi',
    region: 'Maluku-Papua',
    summary: 'Pusat kekuasaan empat kesultanan besar (Ternate, Tidore, Jailolo, Bacan).',
    image: '/images/provinces/maluku-utara.jpg',
    timeline: [
      { year: '1257', title: 'Kesultanan Ternate', description: 'Didirikan oleh Baab Mashur Malamo, pengendali perdagangan cengkeh utama.' }
    ],
    tradition: {
      name: 'Bambu Gila',
      image: '/images/tradition/kololi-kie.jpg',
      desc: 'Permainan tradisional menggunakan bambu yang bergerak secara gaib melalui doa-doa.',
      philosophy: 'Kerja sama tim dalam mengendalikan kekuatan alam.',
      gallery: ['/images/tradition/kololi-kie.jpg']
    }
  },
  {
    id: 'irian-jaya-timur', // GeoJSON: "IRIAN JAYA TIMUR" → normalisasi: "irian-jaya-timur" (Papua)
    name: 'Papua',
    capital: 'Jayapura',
    region: 'Maluku-Papua',
    summary: 'Induk dari wilayah Papua di Indonesia, memiliki sejarah integrasi yang sangat dinamis.',
    image: '/images/provinces/papua.jpg',
    timeline: [
      { year: '1969', title: 'Pepera', description: 'Penentuan Pendapat Rakyat yang mengesahkan Papua bagian dari Indonesia.' }
    ],
    tradition: {
      name: 'Munar Kabor-Indos',
      image: '/images/tradition/munar-kabor-indos.jpg',
      desc: 'Tradisi inisiasi kedewasaan bagi laki-laki suku Biak.',
      philosophy: 'Kesiapan memikul tanggung jawab sosial dan adat dalam komunitas.',
      gallery: ['/images/tradition/munar-kabor-indos.jpg']
    }
  },
  {
    id: 'irian-jaya-barat', // GeoJSON: "IRIAN JAYA BARAT" → normalisasi: "irian-jaya-barat" (Papua Barat)
    name: 'Papua Barat',
    capital: 'Manokwari',
    region: 'Maluku-Papua',
    summary: 'Provinsi konservasi yang menjadi titik awal penyebaran peradaban modern dan religi di tanah Papua.',
    image: '/images/provinces/papua-barat.jpg',
    timeline: [
      { year: '1855', title: 'Misi Mansinam', description: 'Ottow dan Geissler mendarat pertama kali membawa ajaran Injil.' }
    ],
    tradition: {
      name: 'Magasa',
      image: '/images/tradition/wamendereow.jpg',
      desc: 'Tarian kemenangan dan rasa syukur suku Arfak.',
      philosophy: 'Persatuan yang erat seperti anyaman dalam tarian kelompok.',
      gallery: ['/images/tradition/wamendereow.jpg']
    }
  },
  {
    id: 'papua-selatan', // GeoJSON: tidak ada di sample — sesuaikan jika data tersedia
    name: 'Papua Selatan',
    capital: 'Merauke',
    region: 'Maluku-Papua',
    summary: 'Dataran rendah luas yang menjadi batas timur terjauh wilayah kedaulatan Indonesia.',
    image: '/images/provinces/papua-selatan.jpg',
    timeline: [
      { year: '1902', title: 'Pendirian Pos Merauke', description: 'Belanda membangun pos pemerintahan di wilayah suku Marind.' }
    ],
    tradition: {
      name: 'Pesta Gadjari',
      image: '/images/tradition/bakar-batu.jpg',
      desc: 'Pesta adat suku Marind sebagai tanda syukur atas kesuburan tanah dan hasil bumi.',
      philosophy: 'Keterikatan mendalam antara manusia dengan tanah ulayat.',
      gallery: ['/images/tradition/bakar-batu.jpg']
    }
  },
  {
    id: 'irian-jaya-tengah', // GeoJSON: "IRIAN JAYA TENGAH" → normalisasi: "irian-jaya-tengah" (Papua Tengah)
    name: 'Papua Tengah',
    capital: 'Nabire',
    region: 'Maluku-Papua',
    summary: 'Wilayah yang mencakup puncak-puncak salju abadi dan kekayaan tambang mineral yang masif.',
    image: '/images/provinces/papua-tengah.jpg',
    timeline: [
      { year: '1967', title: 'Eksplorasi Freeport', description: 'Awal dibukanya kontrak penambangan tembaga dan emas di Grasberg.' }
    ],
    tradition: {
      name: 'Karapao',
      image: '/images/tradition/karapao.jpg',
      desc: 'Upacara inisiasi anak laki-laki suku Kamoro di pesisir selatan.',
      philosophy: 'Pemberian identitas adat dan penguatan warisan leluhur sejak dini.',
      gallery: ['/images/tradition/karapao.jpg']
    }
  },
  {
    id: 'papua-pegunungan', // GeoJSON: tidak ada di sample — sesuaikan jika data tersedia
    name: 'Papua Pegunungan',
    capital: 'Wamena',
    region: 'Maluku-Papua',
    summary: 'Satu-satunya provinsi tanpa laut (landlocked) di Indonesia, terletak di jantung Pegunungan Jayawijaya.',
    image: '/images/provinces/papua-pegunungan.jpg',
    timeline: [
      { year: '1938', title: 'Ekspedisi Archbold', description: 'Penemuan Lembah Baliem oleh dunia luar yang berpenduduk padat.' }
    ],
    tradition: {
      name: 'Bakar Batu (Barapen)',
      image: '/images/tradition/waya-hagat-abin.jpg',
      desc: 'Ritual memasak bersama menggunakan batu panas sebagai wujud syukur.',
      philosophy: 'Solidaritas tanpa kasta, kebersamaan, dan penyelesaian konflik.',
      gallery: ['/images/tradition/waya-hagat-abin.jpg']
    }
  },
  {
    id: 'papua-barat-daya', // GeoJSON: tidak ada di sample — sesuaikan jika data tersedia
    name: 'Papua Barat Daya',
    capital: 'Sorong',
    region: 'Maluku-Papua',
    summary: 'Provinsi termuda (ke-38) yang menjadi gerbang utama wisata bahari kelas dunia di Raja Ampat.',
    image: '/images/provinces/papua-barat-daya.jpg',
    timeline: [
      { year: '2022', title: 'Provinsi Bungsu', description: 'Resmi berdiri sebagai provinsi ke-38 dalam sejarah administrasi RI.' }
    ],
    tradition: {
      name: 'Buka Egek',
      image: '/images/tradition/buka-egek.jpg',
      desc: 'Tradisi konservasi laut suku Moi untuk tidak mengambil hasil laut dalam jangka waktu tertentu.',
      philosophy: 'Kearifan lokal dalam menjaga ekosistem dan keberlanjutan sumber daya alam.',
      gallery: ['/images/tradition/buka-egek.jpg']
    }
  }
];