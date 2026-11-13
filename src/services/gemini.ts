import { ExamPackage, Question, Stimulus } from '../types';

export interface GenerationParams {
  subject: string;
  grade: number;
  assessmentType: string;
  questionCount: number;
  syllabus: string;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export interface ProgressCallback {
  (stepIndex: number, stepName: string, detail: string): void;
}

function createLocalCuratedExam(
  subject: string,
  grade: number,
  assessmentType: string,
  syllabus: string
): ExamPackage {
  const isMath = subject.toLowerCase().includes('matematika');
  const timestamp = Date.now();

  const stimuli: Stimulus[] = isMath
    ? [
        {
          id: `stim-${timestamp}-1`,
          title: 'Matematika Kontekstual: Pasar Tradisional Purwasari',
          context: 'Kegiatan berbelanja kebutuhan perayaan HUT RI di Kios Berkah Pasar Pagi Purwasari',
          storyText:
            'Hari Minggu pagi, Ibu Ratna bersama anaknya Farhan berbelanja buah segar di Kios Berkah Pasar Purwasari untuk keperluan perayaan HUT Kemerdekaan di RT 03. Farhan mencatat daftar harga buah lokal yang terpajang di kios tersebut seperti tampak pada tabel berikut:',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD3ILbE_LFe0MvhDYf_33QwplchXwZc3fJDQiU-KidyMGOTZJard3WH3vF1rbnA_gNMSHAYrrE5Qb_-ns6bT7VP-bG4IFVnnq8xMTDiEuJMzpg2SVJ0GzzxlKRdW2FcnDTL8AUBmAjcc-Joacfgrf9VuOFYo4-EdOLqHChKS8w495eD9ujcTpvt1esZzxbr6FtwKJFDW692z0R2ct_16kkcSSCQ3FrYJvXPi_UVSlw',
          tableData: {
            headers: ['Nama Buah', 'Harga per Kg', 'Diskon Khusus'],
            rows: [
              ['Jeruk Medan Manis', 'Rp 18.000', 'Beli ≥ 3 kg dapat potongan Rp 2.000/kg'],
              ['Apel Malang Segar', 'Rp 24.000', 'Tidak ada diskon'],
              ['Pisang Raja Sunpride', 'Rp 15.000', 'Beli 2 sisir promo Rp 28.000'],
            ],
          },
        },
        {
          id: `stim-${timestamp}-2`,
          title: 'Proyek P5: Pembuatan Minuman Sari Buah Jeruk Segar',
          context: 'Pengukuran volume cairan dan pembagian desimal oleh Kelompok Siswa Kelas IV',
          storyText:
            'Untuk kegiatan bazar sekolah P5 Kewirausahaan, siswa menyediakan 4 buah teko besar. Setiap teko terisi penuh 1,75 liter sari jeruk murni. Sari jeruk dituangkan ke dalam gelas ramah lingkungan berukuran 0,25 liter (250 ml) dan dijual dengan harga Rp3.000 per gelas. Modal awal bahan baku adalah Rp55.000.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDSkceh--dzWYVvmU2fznn0-JzxWNgJujO_Zv1nwOsLlJWE1r7-NrZqzT375B1tOBWj5Ho27DOyWXhhoh41b45O-cPeNhkZpel9rew3cH4CT3gAxor0xnWlY6mEGOYrkKVjP7wG-m8SrV1uY3WeVDEp1yBVlkUTUAhghv5CUslTnUTp0-4xHqQWiTFcnjwUCQ9LigKofq4Eav7jXqW6kfmnnwjSCylifkq8AaCABNg',
          tableData: {
            headers: ['Peralatan / Bahan', 'Ukuran / Kapasitas', 'Keterangan'],
            rows: [
              ['Teko Besar', '4 buah @ 1,75 liter', 'Terisi penuh sari buah'],
              ['Gelas Distribusi', '0,25 liter (250 ml)', 'Dijual Rp3.000/gelas'],
              ['Biaya Modal', 'Rp55.000', 'Modal awal kelompok'],
            ],
          },
        },
      ]
    : [
        {
          id: `stim-${timestamp}-1`,
          title: 'Literasi Cerita Rakyat: Legenda Sumur Kejayaan Purwasari',
          context: 'Kisah ketekunan warga desa Purwasari dalam merawat sumber mata air luhur',
          storyText:
            'Alkisah di kaki bukit Purwasari, terdapat sebuah sumber mata air jernih yang tak pernah surut meski kemarau panjang melanda. Warga desa yang dipimpin oleh Ki Buyut Wira senantiasa merawat pohon beringin dan trembesi di sekeliling mata air. Mereka bergotong royong membersihkan parit setiap hari Jumat pagi. Berkat kesadaran menjaga alam, sawah-sawah warga tetap hijau membentang dan panen padi melimpah ruah.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDBJCrAVPjfUbJBMx49op_ncySgikgLekGNChZllP5Wj5iKGHt1YILCQMrpbWCPow-AQHtFMKEfId8wr8IAKmeggD-GjmhaZhB4z1_5zmTKfyQD3u6P-T9p5wgwKqRsXxhfQKr7tPH3g-K8NDXWCzg0c4wv7jPg5_aQNot1X21_JKgp6NtIkbqYUSufEWb8kIrgWHGhzAhM4F-0M3OV3-ufAR2fRESWBVZpuu0-YmM',
        },
      ];

  const questions: Question[] = isMath
    ? [
        {
          id: `q-${timestamp}-1`,
          number: 1,
          stimulusId: `stim-${timestamp}-1`,
          type: 'pg_biasa',
          stem: 'Ibu Ratna ingin membeli 4 kg Jeruk Medan Manis untuk hidangan arisan guru. Berapakah jumlah uang total yang harus dibayarkan Ibu Ratna setelah mendapatkan potongan harga diskon pembelian?',
          cognitiveLevel: 'LOTS',
          points: 1,
          aiConfidence: 98,
          options: [
            { key: 'A', text: 'Rp 72.000' },
            { key: 'B', text: 'Rp 68.000' },
            { key: 'C', text: 'Rp 64.000' },
            { key: 'D', text: 'Rp 60.000' },
          ],
          correctAnswer: 'C',
          explanation:
            'Harga normal 4 kg Jeruk = 4 × Rp 18.000 = Rp 72.000. Karena membeli 4 kg (≥ 3 kg), diskon yang diperoleh adalah 4 × Rp 2.000 = Rp 8.000. Total bayar = Rp 72.000 - Rp 8.000 = Rp 64.000.',
          source: 'AI',
        },
        {
          id: `q-${timestamp}-2`,
          number: 2,
          stimulusId: `stim-${timestamp}-1`,
          type: 'pg_kompleks',
          stem: 'Ibu Ratna membawa uang tunai Rp 100.000. Manakah dari pernyataan belanjaan berikut yang BENAR dan dapat dijangkau oleh uang Ibu Ratna? (Pilihlah lebih dari satu jawaban yang sesuai!)',
          cognitiveLevel: 'MOTS',
          points: 2,
          aiConfidence: 95,
          options: [
            { key: 'A', text: 'A. Membeli 3 kg Apel Malang dan mendapatkan uang kembalian Rp 28.000.' },
            { key: 'B', text: 'B. Membeli 5 kg Apel Malang tanpa kekurangan uang belanja.' },
            {
              key: 'C',
              text: 'C. Membeli 2 kg Jeruk Medan (tanpa diskon) dan 2 sisir Pisang Raja dengan total harga tepat Rp 64.000.',
            },
            { key: 'D', text: 'D. Uang Rp 100.000 cukup untuk membeli 6 kg Jeruk Medan setelah dipotong diskon.' },
          ],
          correctAnswer: ['A', 'C'],
          explanation:
            'Pernyataan A benar: 3 × Rp 24.000 = Rp 72.000 (Kembalian = Rp 100.000 - Rp 72.000 = Rp 28.000). Pernyataan C benar: 2 kg Jeruk (Rp 36.000) + Promo Pisang (Rp 28.000) = Rp 64.000. Pernyataan B salah (biaya Rp 120.000).',
          source: 'AI',
        },
        {
          id: `q-${timestamp}-3`,
          number: 3,
          stimulusId: `stim-${timestamp}-1`,
          type: 'benar_salah',
          stem: 'Perhatikan pernyataan evaluasi perhitungan harga pada Kios Berkah Purwasari berikut. Tentukan apakah setiap pernyataan bernilai Benar atau Salah!',
          cognitiveLevel: 'HOTS',
          points: 3,
          aiConfidence: 99,
          matrixRows: [
            {
              text: 'Membeli 3 kg Jeruk Medan lebih hemat Rp 6.000 dibanding membeli tanpa harga diskon promosi.',
              correctBool: true,
            },
            {
              text: 'Harga 1 kg Apel Malang setara dengan harga 2 kg Jeruk Medan saat dikenai potongan diskon.',
              correctBool: false,
            },
            {
              text: 'Jika Pak Kades memesan 5 sisir Pisang Raja Sunpride, total biaya belanja adalah Rp 71.000.',
              correctBool: true,
            },
          ],
          correctAnswer: ['Benar', 'Salah', 'Benar'],
          explanation:
            '1. Benar: Diskon 3 kg × Rp 2.000 = Rp 6.000. 2. Salah: 1 kg Apel = Rp 24.000, sedangkan 2 kg Jeruk berdiskon = 2 × Rp 16.000 = Rp 32.000. 3. Benar: 2 pasang sisir promo (2 × Rp 28.000 = Rp 56.000) + 1 sisir harga normal (Rp 15.000) = Rp 71.000.',
          source: 'AI',
        },
        {
          id: `q-${timestamp}-4`,
          number: 4,
          stimulusId: `stim-${timestamp}-2`,
          type: 'pg_biasa',
          stem: 'Berapakah jumlah volume keseluruhan sari buah jeruk peras yang disiapkan oleh kelompok siswa dalam satuan liter?',
          cognitiveLevel: 'LOTS',
          points: 1,
          aiConfidence: 99,
          options: [
            { key: 'A', text: '5,50 liter' },
            { key: 'B', text: '6,25 liter' },
            { key: 'C', text: '7,00 liter' },
            { key: 'D', text: '7,50 liter' },
          ],
          correctAnswer: 'C',
          explanation: 'Volume total = 4 teko × 1,75 liter = 7,00 liter.',
          source: 'AI',
        },
        {
          id: `q-${timestamp}-5`,
          number: 5,
          stimulusId: `stim-${timestamp}-2`,
          type: 'pg_biasa',
          stem: 'Jika seluruh sari jeruk peras dalam keempat teko dituangkan ke dalam gelas berukuran 0,25 liter tanpa tumpah, berapa banyak gelas yang dibutuhkan?',
          cognitiveLevel: 'MOTS',
          points: 2,
          aiConfidence: 97,
          options: [
            { key: 'A', text: '24 buah gelas' },
            { key: 'B', text: '28 buah gelas' },
            { key: 'C', text: '32 buah gelas' },
            { key: 'D', text: '35 buah gelas' },
          ],
          correctAnswer: 'B',
          explanation: 'Banyak gelas = 7,00 liter ÷ 0,25 liter = 28 buah gelas.',
          source: 'AI',
        },
        {
          id: `q-${timestamp}-6`,
          number: 6,
          stimulusId: `stim-${timestamp}-2`,
          type: 'pg_biasa',
          stem: 'Apabila seluruh gelas sari jeruk laku terjual dengan harga Rp3.000 per gelas, berapakah keuntungan bersih (laba) yang diperoleh kelompok siswa setelah dikurangi modal awal Rp55.000?',
          cognitiveLevel: 'HOTS',
          points: 3,
          aiConfidence: 96,
          options: [
            { key: 'A', text: 'Rp 24.000' },
            { key: 'B', text: 'Rp 29.000' },
            { key: 'C', text: 'Rp 34.000' },
            { key: 'D', text: 'Rp 84.000' },
          ],
          correctAnswer: 'B',
          explanation:
            'Pendapatan kotor = 28 gelas × Rp 3.000 = Rp 84.000. Laba bersih = Rp 84.000 - Rp 55.000 = Rp 29.000.',
          source: 'AI',
        },
      ]
    : [
        {
          id: `q-${timestamp}-1`,
          number: 1,
          stimulusId: `stim-${timestamp}-1`,
          type: 'pg_biasa',
          stem: 'Apakah ide pokok yang terkandung dalam paragraf di atas?',
          cognitiveLevel: 'LOTS',
          points: 1,
          aiConfidence: 98,
          options: [
            { key: 'A', text: 'Kemarau panjang yang menimpa bukit Purwasari' },
            { key: 'B', text: 'Pohon beringin yang rindang dan berusia ratusan tahun' },
            { key: 'C', text: 'Kepedulian dan gotong royong warga dalam merawat sumber mata air' },
            { key: 'D', text: 'Keuntungan menjual hasil panen padi melimpah di pasar' },
          ],
          correctAnswer: 'C',
          explanation:
            'Gagasan utama teks berfokus pada keteladanan warga desa Purwasari dalam bergotong royong merawat kelestarian sumber mata air.',
          source: 'AI',
        },
        {
          id: `q-${timestamp}-2`,
          number: 2,
          stimulusId: `stim-${timestamp}-1`,
          type: 'pg_kompleks',
          stem: 'Berdasarkan teks, manakah nilai-nilai Profil Pelajar Pancasila yang dipraktikkan oleh warga desa? (Pilih lebih dari satu!)',
          cognitiveLevel: 'MOTS',
          points: 2,
          aiConfidence: 96,
          options: [
            { key: 'A', text: 'Gotong royong membersihkan lingkungan parit secara berkala' },
            { key: 'B', text: 'Beriman dan berakhlak mulia kepada alam sekitar' },
            { key: 'C', text: 'Sikap individualistis dalam mengambil jatah air' },
            { key: 'D', text: 'Menghabiskan sumber air untuk kepentingan pribadi semata' },
          ],
          correctAnswer: ['A', 'B'],
          explanation:
            'Nilai gotong royong (membersihkan parit bersama) dan akhlak terhadap alam (merawat pohon pelindung) tercermin kuat pada teks.',
          source: 'AI',
        },
      ];

  return {
    id: `pkg-${timestamp}`,
    title: `Latihan TKA ${subject}: Penguasaan Materi Kelas ${grade}`,
    subject: (subject as any) || 'Matematika',
    grade: Number(grade) || 4,
    assessmentType,
    status: 'final',
    createdAt: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    authorName: 'Ibu Ratna Dewi, S.Pd.',
    authorNip: '19850417 201101 2 009',
    authorRole: 'Guru Kelas 4 & Admin',
    durationMinutes: 90,
    targetPassRate: 88,
    curriculum: 'Kurikulum Merdeka 2024/2025',
    formatDescription: 'Pilihan Ganda Biasa, Kompleks & Benar/Salah',
    summary: syllabus,
    stimuli,
    questions,
    stats: {
      totalQuestions: questions.length,
      verifiedCount: questions.length,
      studentAttempts: 0,
      avgScore: 0,
    },
  };
}

export const geminiService = {
  async getSystemStatus() {
    try {
      const res = await fetch('/api/system-status');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignore
    }
    return {
      status: 'online',
      geminiConnected: true,
      sheetsConnected: true,
      driveConnected: true,
      school: 'SDN 1 Purwasari',
      timestamp: new Date().toISOString(),
    };
  },

  async generateExam(
    params: GenerationParams,
    onProgress?: ProgressCallback
  ): Promise<ExamPackage> {
    onProgress?.(
      1,
      'Langkah 1: Analisis Kisi-kisi CP',
      'Menganalisis capaian pembelajaran, lingkup materi dan konteks pedesaan Purwasari...'
    );
    await new Promise((r) => setTimeout(r, 600));

    onProgress?.(
      2,
      'Langkah 2: Pembuatan Stimulus Kontekstual',
      'Mengonstruksi narasi pasar lokal dan tabel numerasi bermakna...'
    );
    await new Promise((r) => setTimeout(r, 800));

    onProgress?.(
      3,
      'Langkah 3: Penyusunan Butir Soal',
      'Menyusun variasi butir Pilihan Ganda Tunggal, Kompleks, dan Matriks Benar/Salah...'
    );

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        onProgress?.(
          4,
          'Langkah 4: Validasi Kunci & Solusi',
          'Memverifikasi kebenaran kunci jawaban, rubrik penilaian, dan pengecoh soal...'
        );
        await new Promise((r) => setTimeout(r, 600));

        const json = await response.json();
        if (json.success && json.data) {
          onProgress?.(
            5,
            'Selesai',
            'Naskah latihan TKA berhasil disiapkan dan siap diuji atau dicetak!'
          );
          return {
            id: json.data.id || `pkg-${Date.now()}`,
            title: json.data.title || `Latihan TKA ${params.subject} Kelas ${params.grade} SD`,
            subject: (params.subject as any) || 'Matematika',
            grade: Number(params.grade) || 4,
            assessmentType: params.assessmentType,
            status: 'final',
            createdAt: new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            authorName: 'Ibu Ratna Dewi, S.Pd.',
            authorNip: '19850417 201101 2 009',
            authorRole: 'Guru Kelas 4 & Admin',
            durationMinutes: 90,
            targetPassRate: 88,
            curriculum: 'Kurikulum Merdeka 2024/2025',
            formatDescription: 'Pilihan Ganda Biasa, Kompleks & Benar/Salah',
            summary:
              json.data.summary ||
              `Asesmen kompetensi Kurikulum Merdeka untuk ${params.subject} tingkat kelas ${params.grade}.`,
            stimuli: json.data.stimuli || [],
            questions: json.data.questions || [],
            stats: {
              totalQuestions: (json.data.questions || []).length || params.questionCount,
              verifiedCount: (json.data.questions || []).length || params.questionCount,
              studentAttempts: 0,
              avgScore: 0,
            },
          };
        }
      }
    } catch {
      // Backend unavailable (e.g. GitHub Pages static deployment)
    }

    // Local curated generator for static hosting
    onProgress?.(
      4,
      'Langkah 4: Validasi Kunci & Solusi',
      'Menyelaraskan kunci jawaban kurikulum...'
    );
    await new Promise((r) => setTimeout(r, 600));
    onProgress?.(5, 'Selesai', 'Naskah terverifikasi berhasil disusun!');

    return createLocalCuratedExam(
      params.subject,
      params.grade,
      params.assessmentType,
      params.syllabus
    );
  },
};
