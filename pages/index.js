import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoChevronDown, IoShieldCheckmarkSharp, IoMailSharp, IoLogoWhatsapp, IoCallSharp, IoInformationCircleSharp, IoLinkSharp } from 'react-icons/io5';
import Link from 'next/link';
import Head from 'next/head';
import { FaQuoteLeft, FaStar, FaRobot, FaSearch, FaCalendarAlt, FaFileImport, FaChartBar, FaSync, FaLink, FaMobileAlt, FaComments, FaEye, FaRocket, FaCloud, FaUserMd, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState('id');
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  const toggleFaq = (index) => setFaqOpen(faqOpen === index ? null : index);

  const content = {
    id: {
      title: 'Aibiz.id: RME AI Praktik Mandiri | Dokter, Bidan, Perawat',
      metaDescription: 'Aibiz.id: Sistem Rekam Medis Elektronik (RME) berbasis AI untuk Dokter, Bidan, Perawat. Kelola praktik mandiri dengan mudah dan efisien!',
      hero: {
        headline: 'RME AI: Solusi Praktis untuk Praktik Dokter Mandiri',
        subheadline: 'Kelola rekam medis pasien dengan mudah, aman, dan efisien. Sistem Rekam Medis Elektronik (RME) berbasis AI untuk Dokter, Bidan, dan Perawat.',
        cta: 'Konsultasi Gratis Sekarang',
      },
      certifications: {
        title: 'RME AIBIZ.ID Resmi Terdaftar',
        desc: 'Aibiz.id telah terverifikasi dan memenuhi standar keamanan serta kualitas yang ditetapkan.',
        items: [
          { href: 'https://pse.komdigi.go.id/tdpse-detail/22269', src: '/assets/PSE_AIBIZ.ID.png', alt: 'PSE Kominfo', key: 'pse' },
          { href: 'https://satusehat.kemkes.go.id/platform/system-rme-list/1117', src: '/assets/KEMENKES_AIBIZ.ID.png', alt: 'Kemenkes RI', key: 'kemenkes' },
          { href: 'https://cdn.rri.co.id/berita/Palangkaraya/o/1730492191698-1000047948/lph8eqrsdmeyiz2.png', src: 'https://cdn.rri.co.id/berita/Palangkaraya/o/1730492191698-1000047948/lph8eqrsdmeyiz2.png', alt: 'SatuSehat', key: 'satusehat' },
        ],
      },
      poweredBy: {
        title: 'Powered By',
        items: [
          { href: 'https://aibiz.id', src: 'https://freelogopng.com/images/all_img/1664285914google-play-logo-png.png', alt: 'Google Play Store', key: 'google' },
          { href: 'https://aibiz.id', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/2048px-App_Store_%28iOS%29.svg.png', alt: 'App Store', key: 'appstore' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/OpenAI_logo_2025_%28symbol%29.svg/1200px-OpenAI_logo_2025_%28symbol%29.svg.png', alt: 'OpenAI', key: 'openai' },
          { src: 'https://lh3.googleusercontent.com/pw/AP1GczNw7S3fohhIYGJji4ZtwyhNI2pj_TqREZ5pfYbH1dZxhT4-32ftHST8kTA8NuMFYC52g5ZR5P2lXBMZX2FX0zJZmiNa3ArVFcQxgREgOgnb0dYHTiuPJx0Wt7TsJ-DTsElDrbfzc85M-q0aFEdhD1w=w512-h512-s-no', alt: 'Gemini AI', key: 'gemini' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png', alt: 'Python', key: 'python' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flutter_logo.svg/800px-Flutter_logo.svg.png', alt: 'Flutter', key: 'flutter' },
        ],
      },
      services: {
        title: 'Layanan Kami',
        subtitle: 'Solusi RME berbasis AI yang tepat untuk praktik mandiri Anda.',
        items: [
          { title: 'RME Cloud Berbasis AI', desc: 'Akses RME Anda dari mana saja, kapan saja, dengan keamanan terjamin.', icon: <FaCloud />, key: 'cloud' },
          { title: 'Aplikasi Mobile RME', desc: 'Kelola rekam medis pasien langsung dari smartphone atau tablet Anda.', icon: <FaMobileAlt />, key: 'mobile' },
          { title: 'Integrasi AI untuk Diagnosis', desc: 'Dapatkan bantuan AI dalam mendiagnosis penyakit berdasarkan data rekam medis.', icon: <FaUserMd />, key: 'diagnosis' },
        ],
        testimonial: {
          quote: 'Setelah menggunakan RME Aibiz.id, pengelolaan rekam medis pasien menjadi jauh lebih terstruktur dan efisien. Fitur AI untuk diagnosis juga sangat membantu dalam pengambilan keputusan klinis.',
          author: 'dr. Amelia, Dokter Umum',
          key: 'amelia',
        },
      },
      portfolio: {
        title: 'Portfolio Kami',
        subtitle: 'Implementasi RME di berbagai praktik dokter mandiri.',
        items: [
          {
            category: 'dokter',
            title: 'Praktik Dokter Umum dr. Budi',
            desc: 'Implementasi RME untuk pengelolaan rekam medis pasien dengan fitur lengkap dan terintegrasi.',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczM9sYEZTql68aR04Z4lFnu63QoJGYIdcoXPxp-RAi3ZEcSA_q0PL4HsxCHX7HvWdb_W-QYC7QgKEyrJWRLHs-NKW8k_tIag9NtU41D_xDy1hdA_g31Frrj_T8JyLSWq2OzFslEj7_2TTVB-aedDXsg=w2302-h1536-s-no',
            href: 'https://praktikdokter.web.app/',
            key: 'budi',
          },
          {
            category: 'bidan',
            title: 'Klinik Bidan Delima',
            desc: 'RME untuk pengelolaan kehamilan, persalinan, dan perawatan bayi dengan mudah dan terstruktur.',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczNDXGNwB05EjioMbQiGwldrPAZJFtebD10fEj9NVrt7dCQIHoNUG_E_sHEzo4grmSPQhy8-InGSdM9N55iTftezadMlAlgG47nn7xjPSenjETKruYxBDnbmFherZWwDoAmtThZKr7yB4tFkQqgZl6w=w2304-h1536-s-no',
            href: 'http://praktikbidan.web.app',
            key: 'delima',
          },
          {
            category: 'perawat',
            title: 'Praktik Perawat Mandiri Ibu Ani',
            desc: 'RME untuk pencatatan riwayat kesehatan pasien, pemantauan kondisi, dan pengelolaan obat.',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczNP8ptaZDtgGwLyYSMKUhNDThlgOjdq4VR-n1t8-QJOgQXAb5PiQF08yQR37FkFl4V0eKgVc7ckmo2RkV8VPgOExhvgTxvJbU5r91ERWE3Hkj15J8-uQmddEUXxf2bwg9Fl_OFOqlr98pDkzPPxe0g=w2000-h1333-s-no',
            href: 'http://perawat.web.app',
            key: 'ani',
          },
        ],
      },
      blog: {
        title: 'Tips Menggunakan RME',
        subtitle: 'Artikel-artikel terbaru seputar pemanfaatan RME untuk praktik mandiri.',
        items: [
          { title: 'Implementasikan AI untuk Pengambilan Keputusan Klinis', excerpt: 'Pelajari bagaimana fitur AI dapat membantu dokter, bidan, dan perawat membuat keputusan klinis yang lebih akurat dan tepat waktu...', href: '/implementasi-ai', icon: <FaRobot />, key: 'ai-clinical', tip: 0 },
          { title: 'Optimalkan Pencarian Data Pasien dengan Fitur AI', excerpt: 'Temukan data pasien dengan cepat dan akurat menggunakan fitur pencarian berbasis AI di RME Aibiz.id...', href: '/optimalkan-pencarian-data', icon: <FaSearch />, key: 'ai-search', tip: 1 },
          { title: 'Jadwalkan Janji Temu Pasien Secara Online', excerpt: 'Integrasikan RME dengan sistem penjadwalan online untuk memudahkan pasien membuat janji temu dan mengurangi antrean...', href: '/jadwal-janji-temu', icon: <FaCalendarAlt />, key: 'scheduling', tip: 2 },
          { title: '5 Langkah Mudah Mengimpor Data Pasien ke RME', excerpt: 'Pelajari cara memigrasi data pasien lama ke RME Aibiz.id dengan cepat dan mudah. Ikuti panduan langkah demi langkah ini...', href: '/impor-data-pasien', icon: <FaFileImport />, key: 'import-data', tip: 3 },
          { title: 'Analisis Data Pasien untuk Meningkatkan Layanan', excerpt: 'Manfaatkan fitur analisis data untuk memahami tren kesehatan pasien dan meningkatkan kualitas layanan Anda...', href: '/analisis-data-pasien', icon: <FaChartBar />, key: 'data-analysis', tip: 4 },
          { title: 'Integrasi RME dengan Sistem Informasi Lain', excerpt: 'Hubungkan RME dengan sistem informasi apotek, laboratorium, atau asuransi untuk alur kerja yang lebih efisien...', href: '/integrasi-rme', icon: <FaSync />, key: 'integration', tip: 5 },
          { title: 'Perluas Jangkauan Praktik dengan Integrasi Telemedis', excerpt: 'Tawarkan konsultasi jarak jauh kepada pasien Anda dengan integrasi telemedis yang mudah dan aman...', href: '/telemedis-integrasi', icon: <FaLink />, key: 'telemedicine', tip: 6 },
          { title: 'Manfaatkan Aplikasi Mobile RME untuk Kunjungan Rumah', excerpt: 'Gunakan aplikasi mobile RME untuk mengakses data pasien saat melakukan kunjungan rumah. Catat hasil pemeriksaan langsung dari smartphone Anda...', href: '/aplikasi-mobile-rme', icon: <FaMobileAlt />, key: 'mobile-visits', tip: 7 },
          { title: 'Komunikasi dengan Pasien Melalui Fitur Chat RME', excerpt: 'Gunakan fitur chat di RME untuk berkomunikasi dengan pasien, memberikan informasi, atau menjawab pertanyaan mereka...', href: '/chat-rme', icon: <FaComments />, key: 'chat', tip: 8 },
        ],
      },
      about: {
        title: 'Tentang Kami',
        subtitle: 'Kisah kami dalam memajukan praktik mandiri melalui RME inovatif.',
        desc: [
          'Aibiz.id hadir untuk membantu dokter, bidan, dan perawat mengelola praktik mandiri dengan lebih efisien melalui Sistem Rekam Medis Elektronik (RME) berbasis AI yang inovatif dan terjangkau.',
          'Kami percaya bahwa teknologi AI dapat meningkatkan kualitas layanan kesehatan dengan memudahkan pengelolaan data pasien dan membantu pengambilan keputusan klinis.',
        ],
        vision: 'Menjadi penyedia solusi RME terdepan di Indonesia.',
        mission: 'Menyediakan RME berbasis AI yang inovatif, user-friendly, dan terjangkau untuk praktik mandiri.',
        image: 'https://lh3.googleusercontent.com/pw/AP1GczNtVkWCZZX1kS0dOlsfse9pZWqcwdYYn_Pq0RYSTmoPrUW8lAX3U3P5Zcx6DrbS2ISqIGW9SydUClcju2c18vpeqBugmmb_BFDfFHnFHT6zNhAW4y12Abnu_xqH0j6wrow0kPZ3mfz0_bR3Ep5njek=w1974-h1536-s-no',
        key: 'about',
      },
      contact: {
        title: 'Hubungi Kami',
        subtitle: 'Dapatkan konsultasi gratis untuk implementasi RME di praktik Anda.',
        phone: '+6287780945321',
        email: 'cs@aibiz.id',
        address: 'Umbulharjo, Kota Yogyakarta, DIY, Indonesia 55165',
        map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.9234687849516!2d110.39066957490894!3d-7.797927477401125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a57791b386899%3A0x5d2552dec656a784!2sALDAY%20GRUP%20OFFICE!5e0!3m2!1sen!2sid!4v1734373702095!5m2!1sen!2sid',
        key: 'contact',
      },
      footer: {
        copyright: `© ${new Date().getFullYear()} Aibiz.id | Didukung oleh PT Aplikasi Alday Indonesia`,
        links: [
          { href: 'https://aldaygrup.biz.id', text: 'PT Aplikasi Alday Indonesia', key: 'alday' },
        ],
      },
    },
    en: {
      title: 'Aibiz.id: AI-Powered EMR for Independent Practices | Doctors, Midwives, Nurses',
      metaDescription: 'Aibiz.id: AI-based Electronic Medical Record (EMR) system for Doctors, Midwives, and Nurses. Manage your independent practice easily and efficiently!',
      hero: {
        headline: 'AI EMR: Practical Solution for Independent Medical Practices',
        subheadline: 'Manage patient medical records easily, securely, and efficiently. AI-based Electronic Medical Record (EMR) system for Doctors, Midwives, and Nurses.',
        cta: 'Free Consultation Now',
      },
      certifications: {
        title: 'AIBIZ.ID EMR Officially Registered',
        desc: 'Aibiz.id has been verified and meets the established security and quality standards.',
        items: [
          { href: 'https://pse.komdigi.go.id/tdpse-detail/22269', src: '/assets/PSE_AIBIZ.ID.png', alt: 'PSE Kominfo', key: 'pse' },
          { href: 'https://satusehat.kemkes.go.id/platform/system-rme-list/1117', src: '/assets/KEMENKES_AIBIZ.ID.png', alt: 'Ministry of Health RI', key: 'kemenkes' },
          { href: 'https://satusehat.kemkes.go.id/platform/system-rme-list/1117', src: 'https://cdn.rri.co.id/berita/Palangkaraya/o/1730492191698-1000047948/lph8eqrsdmeyiz2.png', alt: 'SatuSehat', key: 'satusehat' },
        ],
      },
      poweredBy: {
        title: 'Powered By',
        items: [
          { href: 'https://aibiz.id', src: 'https://freelogopng.com/images/all_img/1664285914google-play-logo-png.png', alt: 'Google Play Store', key: 'google' },
          { href: 'https://aibiz.id', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/2048px-App_Store_%28iOS%29.svg.png', alt: 'App Store', key: 'appstore' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/OpenAI_logo_2025_%28symbol%29.svg/1200px-OpenAI_logo_2025_%28symbol%29.svg.png', alt: 'OpenAI', key: 'openai' },
          { src: 'https://lh3.googleusercontent.com/pw/AP1GczNw7S3fohhIYGJji4ZtwyhNI2pj_TqREZ5pfYbH1dZxhT4-32ftHST8kTA8NuMFYC52g5ZR5P2lXBMZX2FX0zJZmiNa3ArVFcQxgREgOgnb0dYHTiuPJx0Wt7TsJ-DTsElDrbfzc85M-q0aFEdhD1w=w512-h512-s-no', alt: 'Gemini AI', key: 'gemini' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png', alt: 'Python', key: 'python' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flutter_logo.svg/800px-Flutter_logo.svg.png', alt: 'Flutter', key: 'flutter' },
        ],
      },
      services: {
        title: 'Our Services',
        subtitle: 'AI-based EMR solutions tailored for your independent practice.',
        items: [
          { title: 'AI-Powered Cloud EMR', desc: 'Access your EMR from anywhere, anytime, with guaranteed security.', icon: <FaCloud />, key: 'cloud' },
          { title: 'Mobile EMR App', desc: 'Manage patient medical records directly from your smartphone or tablet.', icon: <FaMobileAlt />, key: 'mobile' },
          { title: 'AI Diagnosis Integration', desc: 'Get AI assistance in diagnosing diseases based on medical record data.', icon: <FaUserMd />, key: 'diagnosis' },
        ],
        testimonial: {
          quote: 'After using Aibiz.id’s EMR, managing patient records has become much more structured and efficient. The AI diagnosis feature greatly aids clinical decision-making.',
          author: 'Dr. Amelia, General Practitioner',
          key: 'amelia',
        },
      },
      portfolio: {
        title: 'Our Portfolio',
        subtitle: 'EMR implementations in various independent medical practices.',
        items: [
          {
            category: 'dokter',
            title: 'Dr. Budi’s General Practice',
            desc: 'EMR implementation for comprehensive and integrated patient record management.',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczM9sYEZTql68aR04Z4lFnu63QoJGYIdcoXPxp-RAi3ZEcSA_q0PL4HsxCHX7HvWdb_W-QYC7QgKEyrJWRLHs-NKW8k_tIag9NtU41D_xDy1hdA_g31Frrj_T8JyLSWq2OzFslEj7_2TTVB-aedDXsg=w2302-h1536-s-no',
            href: 'https://praktikdokter.web.app/',
            key: 'budi',
          },
          {
            category: 'bidan',
            title: 'Delima Midwife Clinic',
            desc: 'EMR for managing pregnancy, childbirth, and infant care easily and systematically.',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczNDXGNwB05EjioMbQiGwldrPAZJFtebD10fEj9NVrt7dCQIHoNUG_E_sHEzo4grmSPQhy8-InGSdM9N55iTftezadMlAlgG47nn7xjPSenjETKruYxBDnbmFherZWwDoAmtThZKr7yB4tFkQqgZl6w=w2304-h1536-s-no',
            href: 'http://praktikbidan.web.app',
            key: 'delima',
          },
          {
            category: 'perawat',
            title: 'Ibu Ani’s Independent Nursing Practice',
            desc: 'EMR for recording patient health histories, monitoring conditions, and managing medications.',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczNP8ptaZDtgGwLyYSMKUhNDThlgOjdq4VR-n1t8-QJOgQXAb5PiQF08yQR37FkFl4V0eKgVc7ckmo2RkV8VPgOExhvgTxvJbU5r91ERWE3Hkj15J8-uQmddEUXxf2bwg9Fl_OFOqlr98pDkzPPxe0g=w2000-h1333-s-no',
            href: 'http://perawat.web.app',
            key: 'ani',
          },
        ],
      },
      blog: {
        title: 'Tips for Using EMR',
        subtitle: 'Latest articles on leveraging EMR for independent practices.',
        items: [
          { title: 'Implement AI for Clinical Decision-Making', excerpt: 'Learn how AI features can help doctors, midwives, and nurses make more accurate and timely clinical decisions...', href: '/implementasi-ai', icon: <FaRobot />, key: 'ai-clinical', tip: 0 },
          { title: 'Optimize Patient Data Search with AI Features', excerpt: 'Find patient data quickly and accurately using AI-based search features in Aibiz.id’s EMR...', href: '/optimalkan-pencarian-data', icon: <FaSearch />, key: 'ai-search', tip: 1 },
          { title: 'Schedule Patient Appointments Online', excerpt: 'Integrate EMR with online scheduling systems to simplify appointment booking and reduce queues...', href: '/jadwal-janji-temu', icon: <FaCalendarAlt />, key: 'scheduling', tip: 2 },
          { title: '5 Easy Steps to Import Patient Data to EMR', excerpt: 'Learn how to quickly and easily migrate old patient data to Aibiz.id’s EMR with this step-by-step guide...', href: '/impor-data-pasien', icon: <FaFileImport />, key: 'import-data', tip: 3 },
          { title: 'Analyze Patient Data to Improve Services', excerpt: 'Use data analysis features to understand patient health trends and enhance service quality...', href: '/analisis-data-pasien', icon: <FaChartBar />, key: 'data-analysis', tip: 4 },
          { title: 'Integrate EMR with Other Information Systems', excerpt: 'Connect EMR with pharmacy, laboratory, or insurance systems for a more efficient workflow...', href: '/integrasi-rme', icon: <FaSync />, key: 'integration', tip: 5 },
          { title: 'Expand Practice Reach with Telemedicine Integration', excerpt: 'Offer remote consultations to patients with easy and secure telemedicine integration...', href: '/telemedis-integrasi', icon: <FaLink />, key: 'telemedicine', tip: 6 },
          { title: 'Use Mobile EMR App for Home Visits', excerpt: 'Access patient data during home visits using the mobile EMR app. Record examination results directly from your smartphone...', href: '/aplikasi-mobile-rme', icon: <FaMobileAlt />, key: 'mobile-visits', tip: 7 },
          { title: 'Communicate with Patients via EMR Chat Feature', excerpt: 'Use the EMR chat feature to communicate with patients, provide information, or answer their questions...', href: '/chat-rme', icon: <FaComments />, key: 'chat', tip: 8 },
        ],
      },
      about: {
        title: 'About Us',
        subtitle: 'Our story in advancing independent practices through innovative EMR.',
        desc: [
          'Aibiz.id is here to help doctors, midwives, and nurses manage independent practices more efficiently with an innovative and affordable AI-based Electronic Medical Record (EMR) system.',
          'We believe AI technology can enhance healthcare quality by simplifying patient data management and aiding clinical decision-making.',
        ],
        vision: 'To be the leading EMR solution provider in Indonesia.',
        mission: 'To provide innovative, user-friendly, and affordable AI-based EMR for independent practices.',
        image: 'https://lh3.googleusercontent.com/pw/AP1GczNtVkWCZZX1kS0dOlsfse9pZWqcwdYYn_Pq0RYSTmoPrUW8lAX3U3P5Zcx6DrbS2ISqIGW9SydUClcju2c18vpeqBugmmb_BFDfFHnFHT6zNhAW4y12Abnu_xqH0j6wrow0kPZ3mfz0_bR3Ep5njek=w1974-h1536-s-no',
        key: 'about',
      },
      contact: {
        title: 'Contact Us',


        subtitle: 'Get a free consultation for implementing EMR in your practice.',
        phone: '+6287780945321',
        email: 'cs@aibiz.id',
        address: 'Umbulharjo, Kota Yogyakarta, DIY, Indonesia 55165',
        map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.9234687849516!2d110.39066957490894!3d-7.797927477401125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a57791b386899%3A0x5d2552dec656a784!2sALDAY%20GRUP%20OFFICE!5e0!3m2!1sen!2sid!4v1734373702095!5m2!1sen!2sid',
        key: 'contact',
      },
      footer: {
        copyright: `© ${new Date().getFullYear()} Aibiz.id | Supported by PT Aplikasi Alday Indonesia`,
        links: [
          { href: 'https://aldaygrup.biz.id', text: 'PT Aplikasi Alday Indonesia', key: 'alday' },
        ],
      },
    },
  };

  const handleCtaClick = () => router.push('#kontak');

  return (
    <>
      <Head>
        <title>{content[language].title}</title>
        <meta name="description" content={content[language].metaDescription} />
        <meta name="keywords" content="Aibiz ID, AI EMR, Electronic Medical Record, Independent Practice, Healthcare AI, SatuSehat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Aibiz.id" />
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-T88JHMP9Q9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T88JHMP9Q9');
            `,
          }}
        />
        <style>{`
          body { font-family: 'Montserrat', sans-serif; }
          .navbar { transition: background-color 0.3s ease; }
          .navbar-light .navbar-nav .nav-link { color: #005566; font-weight: 600; }
          .navbar-light .navbar-nav .nav-link:hover { color: #00a8b5; }
          .btn-primary { background-color: #00a8b5; border-color: #00a8b5; }
          .btn-primary:hover { background-color: #005566; border-color: #005566; }
          .masthead { background: linear-gradient(to bottom, #e6f4f5, #ffffff); padding: 7rem 0; }
          .masthead-heading { color: #005566; font-weight: 700; }
          .masthead-subheading { color: #666; }
          .section { padding: 5rem 0; }
          .section-heading { color: #005566; font-weight: 700; }
          .section-subheading { color: #666; }
          .service-card { text-align: center; padding: 2rem; }
          .service-icon { font-size: 3rem; color: #00a8b5; margin-bottom: 1rem; }
          .testimoni-card { background: #f8f9fa; padding: 2rem; border-radius: 10px; }
          .portfolio-item .card { transition: transform 0.3s ease; }
          .portfolio-item .card:hover { transform: translateY(-10px); }
          .portfolio-filter .btn { margin: 0.2rem; }
          .blog-post { display: none; align-items: center; margin-bottom: 1rem; }
          .blog-post.active { display: flex; }
          .blog-icon { font-size: 3rem; color: #00a8b5; margin-right: 1rem; }
          .tip-selector button { margin: 0.2rem; width: 40px; height: 40px; border-radius: 50%; }
          .about-card { background: #f8f9fa; border-radius: 10px; }
          .about-image { border-radius: 10px; }
          .about-icon { color: #00a8b5; margin-right: 0.5rem; }
          .contact-details-card { background: #f8f9fa; padding: 2rem; border-radius: 10px; }
          .contact-item { margin-bottom: 1rem; }
          .icon-phone, .icon-email, .icon-location { font-size: 1.5rem; color: #00a8b5; margin-right: 0.5rem; }
          .footer { background: #005566; color: #fff; }
          .rme-terdaftar-section { background-color: #f8f9fa; padding: 30px 0; text-align: center; }
          .rme-terdaftar-card { background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 20px; margin: 0 auto; max-width: 100%; }
          .rme-terdaftar-card h2 { font-size: 1.5rem; margin-bottom: 10px; }
          .rme-terdaftar-card p { color: #666; margin-bottom: 20px; }
          .rme-terdaftar-card a { display: inline-block; margin: 0 15px; }
          .rme-terdaftar-card img { height: 80px; width: auto; transition: transform 0.3s ease; }
          .rme-terdaftar-card img:hover { transform: scale(1.1); }
          .certification-section { background-color: #fff; padding: 20px 0; }
          .powered-by-text { text-align: center; font-size: 14px; color: #666; margin-bottom: 10px; }
          .certification-slider-container { width: 100%; overflow-x: auto; overflow-y: hidden; position: relative; padding: 10px 0; white-space: nowrap; display: flex; justify-content: center; }
          .certification-slider { display: inline-block; white-space: nowrap; transition: transform 0.3s ease; }
          .certification-slider img { height: 60px; width: auto; transition: transform 0.3s ease; margin: 0 10px; display: inline-block; }
          .certification-slider img:hover { transform: scale(1.2); }
        `}</style>
      </Head>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={`navbar navbar-expand-lg navbar-light fixed-top ${scrolled ? 'bg-white shadow' : 'bg-transparent'}`}
          id="mainNav"
        >
          <div className="container">
            <motion.a
              whileHover={{ scale: 1.05 }}
              className="navbar-brand"
              href="#page-top"
            >
              <img src="/assets/favicon.ico" alt="Aibiz Logo" className="logo" style={{ height: '40px' }} />
            </motion.a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link href="#layanan" className="nav-link">{language === 'id' ? 'Layanan Kami' : 'Our Services'}</Link>
                </li>
                <li className="nav-item">
                  <Link href="#portfolio" className="nav-link">{language === 'id' ? 'Portfolio' : 'Portfolio'}</Link>
                </li>
                <li className="nav-item">
                  <Link href="#blog" className="nav-link">{language === 'id' ? 'Tips RME' : 'EMR Tips'}</Link>
                </li>
                <li className="nav-item">
                  <Link href="#tentang" className="nav-link">{language === 'id' ? 'Tentang Kami' : 'About Us'}</Link>
                </li>
                <li className="nav-item">
                  <Link href="#kontak" className="nav-link">{language === 'id' ? 'Kontak' : 'Contact'}</Link>
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="btn btn-outline-primary mx-2"
              >
                {language === 'id' ? 'EN' : 'ID'}
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#kontak"
                className="btn btn-primary"
              >
                <FaPaperPlane className="me-2" />
                {language === 'id' ? 'Mari Kita Diskusi' : 'Let’s Discuss'}
              </motion.a>
            </div>
          </div>
        </motion.nav>

        {/* Masthead */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="masthead"
          id="page-top"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 masthead-content animate__animated animate__fadeIn">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="masthead-heading"
                >
                  {content[language].hero.headline}
                </motion.h1>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="masthead-subheading"
                >
                  {content[language].hero.subheadline}
                </motion.p>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="#kontak"
                  className="btn btn-primary"
                >
                  <FaPaperPlane className="me-2" />
                  {content[language].hero.cta}
                </motion.a>
              </div>
              <div className="col-md-6 masthead-image animate__animated animate__fadeIn">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  src="https://lh3.googleusercontent.com/pw/AP1GczPtodXxfCaGJbduPje9eg7rJ_koOCEvHWsZ9FWVnLD62xYcECG5bGIf4yPKaF7pDy5awPF9_nhJXDYcyzIJgsuxiOWWceAUqHAppBrmn-lWB8j86Ad4gwLvTf3OgbtY_KscP1O2VMdTsJP9hEXVyXk=w2320-h1548-s-no?authuser=0"
                  alt="Ilustrasi RME"
                  className="img-fluid"
                  style={{ borderRadius: '10px' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Certifications Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rme-terdaftar-section"
        >
          <div className="container">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rme-terdaftar-card"
            >
              <h2>{content[language].certifications.title}</h2>
              <p>{content[language].certifications.desc}</p>
              <div>
                {content[language].certifications.items.map((cert) => (
                  <motion.a
                    key={cert.key}
                    whileHover={{ scale: 1.1 }}
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={cert.src} alt={cert.alt} loading="lazy" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Powered By Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="certification-section"
        >
          <div className="container">
            <p className="powered-by-text">{content[language].poweredBy.title}</p>
            <div className="certification-slider-container">
              <motion.div
                animate={{ x: ['0%', '-100%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="certification-slider"
              >
                {content[language].poweredBy.items.map((item) => (
                  <motion.img
                    key={item.key}
                    whileHover={{ scale: 1.2 }}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="page-section section"
          id="layanan"
        >
          <div className="container">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="section-heading text-uppercase"
            >
              {content[language].services.title}
            </motion.h2>
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-subheading text-muted"
            >
              {content[language].services.subtitle}
            </motion.h3>
            <div className="row">
              {content[language].services.items.map((service) => (
                <motion.div
                  key={service.key}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="col-md-4 animate__animated animate__fadeIn"
                >
                  <div className="service-card">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="service-icon"
                    >
                      {service.icon}
                    </motion.div>
                    <h4>{service.title}</h4>
                    <p className="text-muted">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="row mt-5">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="col-md-12"
              >
                <div className="testimoni-card">
                  <FaQuoteLeft className="text-primary mb-3" />
                  <p className="testimoni-text">{content[language].services.testimonial.quote}</p>
                  <p className="testimoni-author">{content[language].services.testimonial.author}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Portfolio Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="page-section section"
          id="portfolio"
        >
          <div className="container">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="section-heading text-uppercase"
            >
              {content[language].portfolio.title}
            </motion.h2>
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-subheading text-muted"
            >
              {content[language].portfolio.subtitle}
            </motion.h3>
            <div className="portfolio-filter">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary active"
                data-filter="all"
              >
                {language === 'id' ? 'Semua' : 'All'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
                data-filter="dokter"
              >
                {language === 'id' ? 'Dokter' : 'Doctors'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
                data-filter="bidan"
              >
                {language === 'id' ? 'Bidan' : 'Midwives'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
                data-filter="perawat"
              >
                {language === 'id' ? 'Perawat' : 'Nurses'}
              </motion.button>
            </div>
            <div className="row portfolio-grid">
              {content[language].portfolio.items.map((project) => (
                <motion.div
                  key={project.key}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`col-md-4 mb-4 portfolio-item animate__animated animate__fadeIn`}
                  data-category={project.category}
                >
                  <div className="card">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={project.image}
                      alt={project.title}
                      className="card-img-top img-fluid"
                      style={{ borderRadius: '10px' }}
                      loading="lazy"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{project.title}</h5>
                      <p className="card-text">{project.desc}</p>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.href}
                        target="_blank"
                        className="btn btn-primary"
                      >
                        {language === 'id' ? 'Lihat Detail' : 'View Details'}
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Blog Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="page-section section"
          id="blog"
        >
          <div className="container">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="section-heading text-uppercase"
            >
              {content[language].blog.title}
            </motion.h2>
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-subheading text-muted"
            >
              {content[language].blog.subtitle}
            </motion.h3>
            <div className="tip-selector">
              {[0, 3, 6].map((start, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFaqOpen(start)}
                  className="btn btn-secondary"
                >
                  {index + 1}
                </motion.button>
              ))}
            </div>
            <div className="blog-container">
              {content[language].blog.items.map((post, index) => (
                <motion.div
                  key={post.key}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`blog-post animate__animated animate__fadeIn ${faqOpen === post.tip || (faqOpen === null && post.tip === 3) ? 'active' : ''}`}
                  data-tip={post.tip}
                >
                  <div className="blog-icon">{post.icon}</div>
                  <div className="blog-post-content">
                    <h4 className="blog-post-title">{post.title}</h4>
                    <p className="blog-post-excerpt">{post.excerpt}</p>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href={post.href}
                      className="btn btn-primary"
                    >
                      {language === 'id' ? 'Baca Selengkapnya' : 'Read More'}
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="page-section section"
          id="tentang"
        >
          <div className="container">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="section-heading text-uppercase"
            >
              {content[language].about.title}
            </motion.h2>
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-subheading text-muted"
            >
              {content[language].about.subtitle}
            </motion.h3>
            <div className="row">
              <div className="col-md-12">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="card about-card"
                >
                  <div className="row g-0 align-items-stretch">
                    <div className="col-md-6">
                      <div className="about-image-container">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={content[language].about.image}
                          alt="Ilustrasi RME"
                          className="about-image img-fluid rounded"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card-body about-text">
                        <h5 className="card-title">{language === 'id' ? 'Aibiz.id - Solusi RME Inovatif' : 'Aibiz.id - Innovative EMR Solutions'}</h5>
                        {content[language].about.desc.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                        <ul className="list-unstyled visi-misi">
                          <li>
                            <p>
                              <FaEye className="about-icon" />
                              <strong>{language === 'id' ? 'Visi:' : 'Vision:'}</strong> {content[language].about.vision}
                            </p>
                          </li>
                          <li>
                            <p>
                              <FaRocket className="about-icon" />
                              <strong>{language === 'id' ? 'Misi:' : 'Mission:'}</strong> {content[language].about.mission}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="page-section section"
          id="kontak"
        >
          <div className="container">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="section-heading text-uppercase"
            >
              {content[language].contact.title}
            </motion.h2>
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-subheading text-muted"
            >
              {content[language].contact.subtitle}
            </motion.h3>
            <div className="row">
              <div className="col-md-12">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="card contact-details-card animate__animated animate__fadeIn"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div id="contactForm">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">{language === 'id' ? 'Nama Lengkap *' : 'Full Name *'}</label>
                          <input type="text" className="form-control" id="name" placeholder={language === 'id' ? 'Nama Lengkap' : 'Full Name'} />
                          <div className="invalid-feedback">{language === 'id' ? 'Nama Lengkap wajib diisi.' : 'Full Name is required.'}</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">{language === 'id' ? 'Email *' : 'Email *'}</label>
                          <input type="email" className="form-control" id="email" placeholder="Email" />
                          <div className="invalid-feedback">{language === 'id' ? 'Email wajib diisi.' : 'Email is required.'}</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label">{language === 'id' ? 'Nomor Telepon *' : 'Phone Number *'}</label>
                          <input type="tel" className="form-control" id="phone" placeholder={language === 'id' ? 'Nomor Telepon' : 'Phone Number'} />
                          <div className="invalid-feedback">{language === 'id' ? 'Nomor Telepon wajib diisi.' : 'Phone Number is required.'}</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label">{language === 'id' ? 'Pesan Anda *' : 'Your Message *'}</label>
                          <textarea className="form-control" id="message" rows="4" placeholder={language === 'id' ? 'Pesan Anda' : 'Your Message'}></textarea>
                          <div className="invalid-feedback">{language === 'id' ? 'Pesan wajib diisi.' : 'Message is required.'}</div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="btn btn-primary"
                          onClick={() => alert('WhatsApp integration placeholder')}
                        >
                          {language === 'id' ? 'Kirim Pesan' : 'Send Message'}
                        </motion.button>
                      </div>
                      <div className="contact-info mt-3">
                        <p>{language === 'id' ? 'Anda juga dapat menghubungi kami melalui:' : 'You can also contact us via:'}</p>
                        <div className="contact-item">
                          <FaPhone className="icon-phone" />
                          <span className="icon-text"><a href={`tel:${content[language].contact.phone}`}>{content[language].contact.phone}</a></span>
                        </div>
                        <div className="contact-item">
                          <FaEnvelope className="icon-email" />
                          <span className="icon-text"><a href={`mailto:${content[language].contact.email}`}>{content[language].contact.email}</a></span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 contact-illustration">
                      <div className="map-container">
                        <iframe
                          src={content[language].contact.map}
                          width="100%"
                          height="350"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div className="contact-item mt-3">
                          <FaMapMarkerAlt className="icon-location" />
                          <span className="icon-text">
                            <a
                              href="https://www.google.com/maps/dir/?api=1&destination=Umbulharjo,+Kota+Yogyakarta,+DIY,+Indonesia+55165"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {content[language].contact.address}
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="footer py-4"
        >
          <div className="container text-center">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {content[language].footer.copyright}
            </motion.p>
          </div>
        </motion.footer>
      </div>
    </>
  );
}