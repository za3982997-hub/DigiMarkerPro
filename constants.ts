
import { Product } from './types';

// Helper to generate IDs
const createId = (cat: string, index: number) => `${cat.toLowerCase().substring(0, 2)}-${index}`;

const COURSES: Product[] = [
  {
    id: 'c-1',
    name: 'Full-Stack Web Development Mastery',
    description: 'Kuasai MERN stack dari nol hingga siap kerja. Belajar membangun aplikasi skala enterprise dengan React, Node.js, dan MongoDB.',
    price: 1850000,
    rating: 4.9,
    reviews: 1250,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    instructor: 'David Miller',
    features: ['80+ Jam Video', 'Proyek Real-world', 'Sertifikat', 'Review Kode'],
    modules: ['HTML/CSS Modern', 'JavaScript Deep Dive', 'React & State Management', 'Node.js Backend', 'Deployment & DevOps']
  },
  {
    id: 'c-2',
    name: 'Advanced AI Engineering with Python',
    description: 'Pelajari cara membangun model LLM sendiri, implementasi RAG, dan otomasi AI untuk bisnis menggunakan Python.',
    price: 2450000,
    rating: 5.0,
    reviews: 430,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    instructor: 'Dr. Alan Turing',
    features: ['Kurikulum AI Terbaru', 'Akses API Premium', 'Sertifikat', 'Live Q&A'],
    modules: ['Python for AI', 'Machine Learning Basics', 'Natural Language Processing', 'Vector Databases', 'AI Ethics']
  },
  {
    id: 'c-3',
    name: 'UI/UX Design Masterclass',
    description: 'Ubah cara Anda mendesain antarmuka. Belajar riset pengguna, wireframing, dan prototyping tingkat lanjut dengan Figma.',
    price: 1200000,
    rating: 4.8,
    reviews: 980,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c',
    instructor: 'Sarah Jenkins',
    features: ['Asset Desain Gratis', 'Tugas Mingguan', 'Portofolio Review', 'Akses Selamanya'],
    modules: ['Design Thinking', 'Visual Hierarchy', 'Prototyping in Figma', 'Usability Testing', 'Freelancing Guide']
  },
  {
    id: 'c-4',
    name: 'Digital Marketing Strategy 2025',
    description: 'Kuasai SEO, SEM, dan Social Media Ads untuk melejitkan bisnis di era digital.',
    price: 850000,
    rating: 4.7,
    reviews: 2100,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    instructor: 'Marcus Aurelius',
    features: ['Case Study Nyata', 'Template Iklan', 'Sertifikat', 'Update Berkala'],
    modules: ['SEO Fundamentals', 'Google Ads Strategy', 'Content Marketing', 'Analytics & Data', 'Growth Hacking']
  },
  {
    id: 'c-5',
    name: 'Cyber Security Essentials',
    description: 'Lindungi infrastruktur digital. Belajar ethical hacking, pencegahan intrusi, dan manajemen risiko keamanan.',
    price: 1550000,
    rating: 4.9,
    reviews: 670,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    instructor: 'Hacker X',
    features: ['Virtual Lab', 'Tantangan CTF', 'E-book Keamanan', 'Sertifikat'],
    modules: ['Networking Security', 'Web Penetration Testing', 'Cryptography', 'Cloud Security', 'Incident Response']
  },
  {
    id: 'c-6',
    name: 'Data Science with R and Python',
    description: 'Analisis data besar menjadi wawasan berharga. Belajar statistik, visualisasi, dan modeling data.',
    price: 1950000,
    rating: 4.8,
    reviews: 540,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    instructor: 'Dr. Maria Lopez',
    features: ['Dataset Raksasa', 'Template Analisis', 'Sertifikat', 'Job Portal'],
    modules: ['Data Wrangling', 'Exploratory Data Analysis', 'Statistical Inference', 'Predictive Modeling', 'Data Viz']
  },
  {
    id: 'c-7',
    name: 'Mobile App Dev with Flutter',
    description: 'Membangun aplikasi Android dan iOS dari satu codebase. Performa native dengan kemudahan Flutter.',
    price: 1350000,
    rating: 4.9,
    reviews: 1120,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
    instructor: 'James Cook',
    features: ['Source Code Lengkap', 'State Management', 'Sertifikat', 'Support Tutor'],
    modules: ['Dart Language', 'Flutter Widgets', 'Firebase Integration', 'State Management (Bloc/Provider)', 'App Store Prep']
  },
  {
    id: 'c-8',
    name: 'Professional Photography Course',
    description: 'Dari pemula hingga fotografer profesional. Kuasai komposisi, lighting, dan editing foto.',
    price: 750000,
    rating: 4.6,
    reviews: 890,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5',
    instructor: 'Tom Black',
    features: ['Tugas Lapangan', 'Lightroom Presets', 'Sertifikat', 'Workshop Group'],
    modules: ['Camera Settings', 'Lighting Techniques', 'Editing in Lightroom', 'Portrait vs Landscape', 'Business of Photography']
  },
  {
    id: 'c-9',
    name: 'E-commerce Business Blueprint',
    description: 'Bangun toko online yang menghasilkan. Strategi sourcing produk, manajemen inventaris, dan scale up.',
    price: 950000,
    rating: 4.7,
    reviews: 1540,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
    instructor: 'Linda Gates',
    features: ['List Supplier', 'Template Bisnis', 'Sertifikat', 'Akses Komunitas'],
    modules: ['Product Research', 'Supplier Management', 'Sales Psychology', 'Customer Retention', 'Scaling Strategy']
  },
  {
    id: 'c-10',
    name: 'Project Management Professional (PMP)',
    description: 'Kuasai metodologi Agile, Scrum, dan Waterfall untuk manajemen proyek yang efisien.',
    price: 1250000,
    rating: 4.8,
    reviews: 730,
    category: 'Kursus',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12',
    instructor: 'Richard Branson',
    features: ['Simulasi Ujian PMP', 'Template Proyek', 'Sertifikat', 'Akses Selamanya'],
    modules: ['Project Lifecycle', 'Risk Management', 'Stakeholder Communication', 'Agile & Scrum', 'Budgeting & Timing']
  },
  { id: 'c-11', name: 'Blockchain Development 101', description: 'Belajar Solidity dan smart contracts.', price: 2100000, rating: 4.9, reviews: 310, category: 'Kursus', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0', features: ['Web3 focus'], modules: ['Ethereum Basics', 'Solidity', 'DApp Creation'] },
  { id: 'c-12', name: 'Game Development with Unity', description: 'Buat game 2D & 3D dari awal.', price: 1650000, rating: 4.8, reviews: 620, category: 'Kursus', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', features: ['Asset Pack'], modules: ['C# for Unity', 'Physics Engine', 'Level Design'] },
  { id: 'c-13', name: 'Copywriting for Conversions', description: 'Seni menulis kata yang menjual.', price: 650000, rating: 4.7, reviews: 2400, category: 'Kursus', image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f', features: ['Swipe File'], modules: ['Headline Psychology', 'Storytelling', 'CTA Optimization'] },
  { id: 'c-14', name: 'Video Editing with Premiere Pro', description: 'Edit video sinematik kelas dunia.', price: 890000, rating: 4.8, reviews: 1450, category: 'Kursus', image: 'https://images.unsplash.com/photo-1535016120720-40c646bebbfc', features: ['LUTS Included'], modules: ['Timeline Basics', 'Color Grading', 'Sound Design'] },
  { id: 'c-15', name: 'Financial Intelligence for Techies', description: 'Manajemen keuangan untuk pekerja IT.', price: 550000, rating: 4.9, reviews: 880, category: 'Kursus', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', features: ['Investment Calculator'], modules: ['Budgeting', 'Stocks & Bonds', 'Crypto for Long Term'] },
  { id: 'c-16', name: 'Public Speaking for Leaders', description: 'Bicara dengan percaya diri di depan umum.', price: 720000, rating: 4.7, reviews: 520, category: 'Kursus', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', features: ['Live Practice'], modules: ['Voice Control', 'Body Language', 'Handling QA'] },
  { id: 'c-17', name: 'Cloud Computing (AWS/Azure)', description: 'Kuasai infrastruktur cloud modern.', price: 2300000, rating: 5.0, reviews: 410, category: 'Kursus', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8', features: ['Sandbox Environment'], modules: ['EC2 & S3', 'Serverless', 'DevOps Pipeline'] },
  { id: 'c-18', name: 'Mental Health for High Achievers', description: 'Menjaga produktivitas tanpa burnout.', price: 450000, rating: 4.9, reviews: 1200, category: 'Kursus', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', features: ['Mindfulness Audio'], modules: ['Stress Management', 'Focus Techniques', 'Work-Life Harmony'] },
  { id: 'c-19', name: 'Go Programming Language Masterclass', description: 'Bahasa pemrograman masa depan dari Google.', price: 1400000, rating: 4.8, reviews: 290, category: 'Kursus', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4', features: ['Backend Projects'], modules: ['Go Syntax', 'Concurrency', 'Building APIs'] },
  { id: 'c-20', name: 'Creative Leadership Mastery', description: 'Pimpin tim kreatif menuju kesuksesan.', price: 1100000, rating: 4.7, reviews: 380, category: 'Kursus', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', features: ['Team Audit Tool'], modules: ['Vision Casting', 'Conflict Resolution', 'Agile Creativity'] },
];

const EBOOKS: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: `eb-${i + 1}`,
  name: `${['Productivity Hacks', 'Wealth Blueprint', 'Code Quality', 'Diet Mastery', 'Travel Guide', 'Startup Secret', 'Mindset Shift'][i % 7]} Vol. ${Math.floor(i / 7) + 1}`,
  description: 'Panduan mendalam yang dirancang untuk memberikan hasil instan dan pengetahuan praktis dalam format digital yang mudah dibawa.',
  price: 49000 + (i * 10000),
  rating: 4.5 + (Math.random() * 0.5),
  reviews: 100 + (i * 50),
  category: 'E-book',
  // Fix: Removed invalid mathematical expression from template literal.
  image: `https://images.unsplash.com/photo-1512820790803-73c7e9afde80?auto=format&fit=crop&q=80&w=400&mock=${i}`,
  features: ['PDF & EPUB', 'Update Seumur Hidup', 'Akses di Semua Perangkat']
}));

const SYSTEMS: Product[] = Array.from({ length: 25 }, (_, i) => ({
  id: `sys-${i + 1}`,
  name: `${['Business CRM', 'Second Brain Notion', 'Inventory Manager', 'Portfolio Tracker', 'Team Hub', 'Client Portal', 'Habit OS'][i % 7]} System ${i + 1}`,
  description: 'Sistem operasional yang sudah jadi untuk membantu Anda mengelola bisnis, kehidupan, atau proyek dengan efisiensi maksimal.',
  price: 299000 + (i * 50000),
  rating: 4.7 + (Math.random() * 0.3),
  reviews: 50 + (i * 20),
  category: 'Sistem',
  // Fix: Removed invalid mathematical expression from template literal.
  image: `https://images.unsplash.com/photo-1504868584819-f8e90526354a?auto=format&fit=crop&q=80&w=400&mock=${i}`,
  features: ['Siap Pakai', 'Tutorial Pemasangan', 'Support Teknikal']
}));

const PRINTABLES: Product[] = Array.from({ length: 30 }, (_, i) => ({
  id: `pr-${i + 1}`,
  name: `${['Daily Planner', 'Goal Setter', 'Budget Sheet', 'Art Print', 'Learning Card', 'Wall Decor'][i % 6]} Bundle ${i + 1}`,
  description: 'Aset digital berkualitas tinggi yang siap dicetak dari rumah Anda sendiri. Desain estetis dan fungsional.',
  price: 15000 + (i * 3000),
  rating: 4.4 + (Math.random() * 0.6),
  reviews: 200 + (i * 10),
  category: 'Cetak',
  // Fix: Removed invalid mathematical expression from template literal.
  image: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400&mock=${i}`,
  features: ['High-Res PDF', 'Berbagai Ukuran', 'Instan Download']
}));

const TOOLKITS: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: `tk-${i + 1}`,
  name: `${['Designer Toolkit', 'Dev Stack', 'Marketing Suite', 'Content Kit'][i % 4]} Premium ${i + 1}`,
  description: 'Kumpulan resource esensial untuk profesional. Hemat waktu ribuan jam dengan aset siap pakai ini.',
  price: 149000 + (i * 40000),
  rating: 4.8 + (Math.random() * 0.2),
  reviews: 80 + (i * 15),
  category: 'Toolkit',
  // Fix: Removed invalid mathematical expression from template literal.
  image: `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400&mock=${i}`,
  features: ['Aset Premium', 'Lisensi Komersial', 'Update Bulanan']
}));

const TEMPLATES: Product[] = Array.from({ length: 30 }, (_, i) => ({
  id: `tm-${i + 1}`,
  name: `${['Pitch Deck', 'Social Media Kit', 'Resume Template', 'Landing Page', 'Email Sequence'][i % 5]} ${i + 1}`,
  description: 'Templat desain profesional yang mudah diedit. Buat presentasi atau konten yang memukau dalam hitungan menit.',
  price: 75000 + (i * 10000),
  rating: 4.6 + (Math.random() * 0.4),
  reviews: 150 + (i * 30),
  category: 'Templat',
  // Fix: Removed invalid mathematical expression from template literal.
  image: `https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=400&mock=${i}`,
  features: ['Mudah Diedit', 'Video Panduan', 'Font Gratis Termasuk']
}));

export const MOCK_PRODUCTS: Product[] = [
  ...COURSES,
  ...EBOOKS,
  ...SYSTEMS,
  ...PRINTABLES,
  ...TOOLKITS,
  ...TEMPLATES
];

export const CATEGORIES: string[] = ['Semua', 'Kursus', 'E-book', 'Sistem', 'Cetak', 'Toolkit', 'Templat'];
