// src/data/news.data.ts
// Warta Nusantara - Berita & Update Budaya Indonesia

export type NewsCategory = 'festival' | 'tradisi' | 'pelestarian' | 'umkm';

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  title: {
    id: string;
    en: string;
  };
  excerpt: {
    id: string;
    en: string;
  };
  content: {
    id: string;
    en: string;
  };
  image: string;
  date: string; // ISO format
  location: string;
  author?: string;
  tags?: string[];
  externalLink?: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-001',
    category: 'festival',
    title: {
      id: 'Festival Batik Nusantara 2025',
      en: 'Nusantara Batik Festival 2025'
    },
    excerpt: {
      id: 'Perayaan batik terbesar di Indonesia menghadirkan ribuan motif dari 34 provinsi. Pameran, workshop, dan fashion show selama 5 hari!',
      en: 'Indonesia\'s largest batik celebration featuring thousands of patterns from 34 provinces. Exhibitions, workshops, and fashion shows for 5 days!'
    },
    content: {
      id: 'Festival Batik Nusantara 2025 kembali hadir di Solo, Jawa Tengah sebagai perayaan warisan budaya tak benda UNESCO. Acara ini menghadirkan lebih dari 500 pengrajin batik dari seluruh Indonesia.\n\nPengunjung dapat menyaksikan langsung proses pembuatan batik tulis, mengikuti workshop membatik, dan menikmati fashion show dengan desain batik kontemporer. Ada juga kompetisi desain batik dengan hadiah total Rp 100 juta!\n\nFestival dibuka untuk umum dengan tiket masuk Rp 25.000. Anak-anak di bawah 12 tahun gratis.',
      en: 'Nusantara Batik Festival 2025 returns to Solo, Central Java as a celebration of UNESCO intangible cultural heritage. This event brings together over 500 batik artisans from across Indonesia.\n\nVisitors can witness the traditional batik-making process, join batik workshops, and enjoy fashion shows featuring contemporary batik designs. There\'s also a batik design competition with a total prize of Rp 100 million!\n\nThe festival is open to the public with an entrance fee of Rp 25,000. Children under 12 get free admission.'
    },
    image: '/news/batik-festival.jpg',
    date: '2025-03-20T09:00:00Z',
    location: 'Solo, Jawa Tengah',
    tags: ['batik', 'festival', 'UNESCO', 'fashion'],
    externalLink: 'https://festivalbatik.co.id'
  },
  {
    id: 'news-002',
    category: 'tradisi',
    title: {
      id: 'Ritual Kasada Gunung Bromo Berlangsung Meriah',
      en: 'Kasada Ritual at Mount Bromo Held Successfully'
    },
    excerpt: {
      id: 'Upacara adat Suku Tengger berlangsung khidmat dengan ribuan persembahan dilempar ke kawah Bromo sebagai wujud syukur.',
      en: 'The traditional ceremony of Tengger tribe held solemnly with thousands of offerings thrown into Bromo crater as gratitude.'
    },
    content: {
      id: 'Upacara Kasada merupakan ritual tahunan masyarakat Suku Tengger di kawasan Gunung Bromo. Tahun ini dihadiri lebih dari 10.000 umat dari berbagai daerah.\n\nRitual dimulai pukul 00.00 WIB dengan prosesi doa di Pura Luhur Poten. Dilanjutkan dengan perjalanan menuju kawah Bromo untuk melempar sesaji berupa hasil bumi, ternak, dan uang.\n\nTradisi ini dipercaya sebagai bentuk penghormatan kepada Sang Hyang Widhi dan leluhur. Acara berlangsung aman dengan pengawasan ketat dari pihak taman nasional.',
      en: 'The Kasada ceremony is an annual ritual of the Tengger tribe in the Mount Bromo area. This year it was attended by more than 10,000 people from various regions.\n\nThe ritual began at 00.00 WIB with a prayer procession at Pura Luhur Poten temple. Continued with a journey to the Bromo crater to throw offerings of crops, livestock, and money.\n\nThis tradition is believed to be a form of respect to Sang Hyang Widhi and ancestors. The event took place safely with strict supervision from national park authorities.'
    },
    image: '/news/kasada-bromo.jpg',
    date: '2025-03-18T00:00:00Z',
    location: 'Probolinggo, Jawa Timur',
    tags: ['ritual', 'Tengger', 'Bromo', 'tradisi'],
  },
  {
    id: 'news-003',
    category: 'pelestarian',
    title: {
      id: 'Wayang Kulit Masuk Kurikulum Sekolah di Yogyakarta',
      en: 'Shadow Puppetry Included in School Curriculum in Yogyakarta'
    },
    excerpt: {
      id: 'Pemerintah DIY meluncurkan program pelestarian wayang kulit dengan memasukkan seni pertunjukan tradisional ke dalam mata pelajaran muatan lokal.',
      en: 'DIY government launches shadow puppetry preservation program by including traditional performing arts in local content subjects.'
    },
    content: {
      id: 'Dinas Pendidikan DIY resmi meluncurkan kurikulum wayang kulit untuk tingkat SD dan SMP. Program ini merupakan upaya pelestarian seni pertunjukan tradisional yang mulai ditinggalkan generasi muda.\n\nSiswa akan belajar sejarah wayang, cara memainkan wayang, dan nilai-nilai filosofis di balik cerita pewayangan. Sekolah juga akan mendapat bantuan gamelan dan seperangkat wayang dari pemerintah.\n\n"Ini investasi jangka panjang untuk masa depan kebudayaan kita," ujar Kepala Dinas Pendidikan DIY. Program dimulai pada semester depan di 50 sekolah percontohan.',
      en: 'DIY Education Office officially launched shadow puppetry curriculum for elementary and junior high schools. This program is an effort to preserve traditional performing arts that are beginning to be abandoned by the younger generation.\n\nStudents will learn the history of wayang, how to perform wayang, and philosophical values behind wayang stories. Schools will also receive gamelan and wayang sets from the government.\n\n"This is a long-term investment for the future of our culture," said the Head of DIY Education Office. The program starts next semester in 50 pilot schools.'
    },
    image: '/news/wayang-sekolah.jpg',
    date: '2025-03-15T10:30:00Z',
    location: 'Yogyakarta',
    tags: ['wayang', 'pendidikan', 'pelestarian', 'budaya'],
  },
  {
    id: 'news-004',
    category: 'umkm',
    title: {
      id: 'Kerajinan Perak Kotagede Tembus Pasar Eropa',
      en: 'Kotagede Silver Craft Penetrates European Market'
    },
    excerpt: {
      id: 'UMKM perak tradisional Kotagede berhasil ekspor ke 5 negara Eropa dengan omzet mencapai Rp 2 miliar per bulan.',
      en: 'Traditional silver UMKM from Kotagede successfully exports to 5 European countries with monthly turnover reaching Rp 2 billion.'
    },
    content: {
      id: 'Pengrajin perak Kotagede, Yogyakarta, kini menembus pasar internasional. "Perak Ayu", UMKM binaan Kementerian Koperasi, berhasil ekspor perhiasan dan kerajinan tangan ke Belanda, Jerman, Prancis, Italia, dan Spanyol.\n\nRahasia kesuksesannya adalah memadukan motif tradisional dengan desain modern. Produk yang paling laris adalah cincin, gelang, dan miniatur candi dengan teknik filigree khas Yogyakarta.\n\nPemilik UMKM, Bapak Suryanto (52), mengatakan: "Kami tetap mempertahankan teknik tradisional sambil mengikuti tren global. Hasilnya, pembeli luar negeri sangat tertarik."\n\nInfo pemesanan: WA 0812-3456-7890 | Instagram @perakayu_official',
      en: 'Silver artisans from Kotagede, Yogyakarta, are now penetrating the international market. "Perak Ayu", an UMKM supported by the Ministry of Cooperatives, successfully exports jewelry and handicrafts to the Netherlands, Germany, France, Italy, and Spain.\n\nThe secret to success is combining traditional motifs with modern designs. The best-selling products are rings, bracelets, and temple miniatures with Yogyakarta\'s signature filigree technique.\n\nUMKM owner, Mr. Suryanto (52), said: "We maintain traditional techniques while following global trends. As a result, foreign buyers are very interested."\n\nOrder info: WA 0812-3456-7890 | Instagram @perakayu_official'
    },
    image: '/news/perak-kotagede.jpg',
    date: '2025-03-12T14:00:00Z',
    location: 'Yogyakarta',
    tags: ['UMKM', 'perak', 'ekspor', 'kerajinan'],
    externalLink: 'https://instagram.com/perakayu_official'
  },
  {
    id: 'news-005',
    category: 'festival',
    title: {
      id: 'Festival Jajanan Pasar Hadirkan 100 Kuliner Tradisional',
      en: 'Traditional Snack Festival Features 100 Traditional Cuisines'
    },
    excerpt: {
      id: 'Festival kuliner terbesar di Jakarta menghadirkan jajanan pasar dari seluruh Nusantara. Ada demo masak dan kompetisi makan juga!',
      en: 'The biggest culinary festival in Jakarta features traditional snacks from all over Nusantara. Cooking demos and eating competitions too!'
    },
    content: {
      id: 'Festival Jajanan Pasar 2025 berlangsung di Lapangan Banteng, Jakarta Pusat. Lebih dari 100 tenant menghadirkan kue-kue tradisional seperti klepon, onde-onde, lemper, risoles, sampai kue putu.\n\nPengunjung bisa ikut workshop membuat jajanan pasar dipandu chef profesional. Ada juga kompetisi makan klepon dengan hadiah jutaan rupiah!\n\nHarga jajanan mulai dari Rp 5.000 saja. Festival berlangsung 3 hari (21-23 Maret) dari pukul 10.00-22.00 WIB. Gratis masuk untuk semua umur!\n\nJangan lewatkan kesempatan mencicipi kuliner warisan nenek moyang kita!',
      en: 'Traditional Snack Festival 2025 takes place at Lapangan Banteng, Central Jakarta. More than 100 tenants present traditional cakes such as klepon, onde-onde, lemper, risoles, to kue putu.\n\nVisitors can join workshops to make traditional snacks guided by professional chefs. There\'s also a klepon eating competition with prizes worth millions of rupiah!\n\nSnack prices start from only Rp 5,000. The festival runs for 3 days (21-23 March) from 10.00-22.00 WIB. Free admission for all ages!\n\nDon\'t miss the opportunity to taste our ancestral culinary heritage!'
    },
    image: '/news/jajanan-pasar.jpg',
    date: '2025-03-10T08:00:00Z',
    location: 'Jakarta Pusat',
    tags: ['kuliner', 'festival', 'jajanan', 'tradisional'],
  },
  {
    id: 'news-006',
    category: 'pelestarian',
    title: {
      id: 'Rumah Adat Tongkonan Dipugar dengan Dana Rp 5 Miliar',
      en: 'Tongkonan Traditional House Renovated with Rp 5 Billion Fund'
    },
    excerpt: {
      id: 'Pemerintah Sulawesi Selatan mengucurkan dana untuk pemugaran 12 rumah adat Tongkonan yang rusak akibat cuaca ekstrem.',
      en: 'South Sulawesi government disburses funds to renovate 12 Tongkonan traditional houses damaged by extreme weather.'
    },
    content: {
      id: 'Dinas Kebudayaan Sulsel mengalokasikan Rp 5 miliar untuk pemugaran rumah adat Tongkonan di Kabupaten Tana Toraja. Proyek ini merupakan respons terhadap kerusakan akibat cuaca ekstrem tahun lalu.\n\n12 Tongkonan akan dipugar dengan tetap mempertahankan keaslian struktur dan ornamen ukiran khas Toraja. Pengerjaan melibatkan para tetua adat dan tukang kayu tradisional.\n\n"Tongkonan bukan sekadar bangunan, tetapi identitas dan kebanggaan masyarakat Toraja. Kita wajib melestarikannya," ujar Gubernur Sulsel.\n\nPemugaran ditargetkan selesai dalam 8 bulan. Masyarakat dapat menyaksikan prosesnya dan belajar tentang arsitektur tradisional Toraja.',
      en: 'South Sulawesi Culture Office allocates Rp 5 billion for the restoration of Tongkonan traditional houses in Tana Toraja Regency. This project is a response to damage caused by extreme weather last year.\n\n12 Tongkonan will be restored while maintaining the authenticity of the structure and typical Toraja carved ornaments. The work involves traditional elders and traditional carpenters.\n\n"Tongkonan is not just a building, but the identity and pride of the Toraja people. We must preserve it," said the Governor of South Sulawesi.\n\nRestoration is targeted to be completed in 8 months. The community can witness the process and learn about traditional Toraja architecture.'
    },
    image: '/news/tongkonan-pugar.jpg',
    date: '2025-03-08T11:00:00Z',
    location: 'Tana Toraja, Sulawesi Selatan',
    tags: ['rumah adat', 'Tongkonan', 'pemugaran', 'Toraja'],
  },
  {
    id: 'news-007',
    category: 'umkm',
    title: {
      id: 'Tenun Ikat NTT Raih Penghargaan di Paris Fashion Week',
      en: 'NTT Ikat Weaving Wins Award at Paris Fashion Week'
    },
    excerpt: {
      id: 'Desainer muda Indonesia membawa tenun ikat NTT ke panggung mode dunia dan meraih Best Cultural Fashion Award.',
      en: 'Young Indonesian designer brings NTT ikat weaving to the world fashion stage and wins Best Cultural Fashion Award.'
    },
    content: {
      id: 'Maria Stefani (28), desainer asal Kupang, berhasil memukau juri Paris Fashion Week 2025 dengan koleksi "Heritage Threads" yang seluruhnya menggunakan tenun ikat dari NTT.\n\nKoleksi ini menggabungkan motif tradisional seperti motif kaif, sotis, dan buna dengan siluet modern. Kain tenun didapat langsung dari pengrajin di Desa Lepo, dengan sistem fair trade.\n\n"Saya ingin dunia tahu bahwa Indonesia punya warisan tekstil yang luar biasa. Tenun ikat NTT tidak kalah dengan fabric mewah Eropa," ujar Maria.\n\nSetelah penghargaan ini, Maria berencana membuka galeri dan workshop tenun di Jakarta untuk memberdayakan lebih banyak pengrajin.\n\nKoleksi dapat dilihat di: www.heritagethreads.id',
      en: 'Maria Stefani (28), a designer from Kupang, successfully impressed the Paris Fashion Week 2025 jury with the "Heritage Threads" collection entirely using ikat weaving from NTT.\n\nThis collection combines traditional motifs such as kaif, sotis, and buna motifs with modern silhouettes. The woven fabrics are obtained directly from artisans in Lepo Village, with a fair trade system.\n\n"I want the world to know that Indonesia has an extraordinary textile heritage. NTT ikat weaving is no less than European luxury fabrics," said Maria.\n\nAfter this award, Maria plans to open a gallery and weaving workshop in Jakarta to empower more artisans.\n\nCollection can be viewed at: www.heritagethreads.id'
    },
    image: '/news/tenun-paris.jpg',
    date: '2025-03-05T16:00:00Z',
    location: 'Paris, Prancis / Kupang, NTT',
    tags: ['tenun', 'fashion', 'UMKM', 'NTT', 'Paris'],
    externalLink: 'https://heritagethreads.id'
  },
  {
    id: 'news-008',
    category: 'tradisi',
    title: {
      id: 'Upacara Ngaben di Bali Dihadiri 5000 Umat Hindu',
      en: 'Ngaben Ceremony in Bali Attended by 5000 Hindus'
    },
    excerpt: {
      id: 'Upacara kremasi massal di Gianyar berlangsung khidmat dengan prosesi adat lengkap dan gamelan Bali.',
      en: 'Mass cremation ceremony in Gianyar held solemnly with complete traditional procession and Balinese gamelan.'
    },
    content: {
      id: 'Upacara Ngaben massal diadakan di Pura Dalem Gianyar dengan mengkremasi 15 jenazah sekaligus. Prosesi dimulai pukul 08.00 WITA dengan persembahyangan di rumah duka masing-masing.\n\nArak-arakan menuju setra (kuburan) diiringi gamelan Bali dan tari-tarian sakral. Bade (tower kremasi) dihias indah dengan ukiran dan kain warna-warni.\n\nUpacara Ngaben adalah ritual penting dalam agama Hindu Bali yang dipercaya membebaskan atma (roh) untuk mencapai kehidupan yang lebih baik.\n\nWisatawan diperbolehkan menyaksikan dari kejauhan dengan berpakaian sopan dan menjaga kekhidmatan acara.',
      en: 'Mass Ngaben ceremony held at Pura Dalem Gianyar cremating 15 bodies at once. The procession began at 08.00 WITA with prayers at each funeral home.\n\nThe procession to setra (cemetery) was accompanied by Balinese gamelan and sacred dances. Bade (cremation tower) is beautifully decorated with carvings and colorful fabrics.\n\nNgaben ceremony is an important ritual in Balinese Hinduism believed to free the atma (spirit) to achieve a better life.\n\nTourists are allowed to watch from a distance while dressing modestly and maintaining the solemnity of the event.'
    },
    image: '/news/ngaben-bali.jpg',
    date: '2025-03-03T08:00:00Z',
    location: 'Gianyar, Bali',
    tags: ['Ngaben', 'Bali', 'Hindu', 'upacara'],
  },
];

// Category metadata
export const newsCategories = [
  {
    id: 'all',
    label: { id: 'Semua', en: 'All' },
    icon: '📰',
    color: '#F14C38'
  },
  {
    id: 'festival',
    label: { id: 'Festival', en: 'Festival' },
    icon: '🎉',
    color: '#FBBF24'
  },
  {
    id: 'tradisi',
    label: { id: 'Tradisi', en: 'Tradition' },
    icon: '🎭',
    color: '#10B981'
  },
  {
    id: 'pelestarian',
    label: { id: 'Pelestarian', en: 'Conservation' },
    icon: '🏛️',
    color: '#3B82F6'
  },
  {
    id: 'umkm',
    label: { id: 'UMKM', en: 'SMEs' },
    icon: '🛍️',
    color: '#8B5CF6'
  },
] as const;

// Helper functions
export function getNewsByCategory(category: NewsCategory | 'all'): NewsArticle[] {
  if (category === 'all') return newsArticles;
  return newsArticles.filter(news => news.category === category);
}

export function getNewsById(id: string): NewsArticle | undefined {
  return newsArticles.find(news => news.id === id);
}

export function formatNewsDate(dateString: string, language: 'id' | 'en'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (language === 'id') {
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return '1 hari lalu';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } else {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}