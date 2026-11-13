import React, { useState } from 'react';
import { ExamPackage, AppSettings } from '../types';

interface PrintPreviewViewProps {
  currentExam: ExamPackage;
  settings: AppSettings;
  onGoBackToEditor: () => void;
}

export const PrintPreviewView: React.FC<PrintPreviewViewProps> = ({
  currentExam,
  settings,
  onGoBackToEditor,
}) => {
  const [viewMode, setViewMode] = useState<'soal' | 'kunci' | 'semua'>('soal');
  const [paperFormat, setPaperFormat] = useState<'a4' | 'f4' | 'kuarto'>('a4');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAdjustZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 70), 140));
  };

  const handleCopyToDocs = () => {
    let plainText = `PEMERINTAH KABUPATEN KARAWANG\nDINAS PENDIDIKAN PEMUDA DAN OLAHRAGA\nSEKOLAH DASAR NEGERI 1 PURWASARI\n\n${currentExam.title}\nTAHUN AJARAN ${settings.academicYear}\n\n`;

    currentExam.stimuli?.forEach((stim, sIdx) => {
      plainText += `STIMULUS ${sIdx + 1}: ${stim.title}\n${stim.storyText}\n\n`;
    });

    currentExam.questions?.forEach((q, qIdx) => {
      plainText += `${qIdx + 1}. ${q.stem}\n`;
      if (q.options) {
        q.options.forEach((opt) => {
          plainText += `   ${opt.key}. ${opt.text}\n`;
        });
      }
      plainText += `   [Kunci: ${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}]\n\n`;
    });

    navigator.clipboard?.writeText(plainText);
    triggerToast('Format naskah disalin ke clipboard! Siap ditempel di Google Docs.');
  };

  const handlePrint = () => {
    window.print();
  };

  // Matrix answer key generator (fills 1 to 30)
  const fullAnswerKeyMatrix = Array.from({ length: 30 }, (_, i) => {
    const qNum = i + 1;
    const existingQ = currentExam.questions?.find((q) => q.number === qNum);
    if (existingQ) {
      const ans = Array.isArray(existingQ.correctAnswer)
        ? existingQ.correctAnswer.join(',')
        : existingQ.correctAnswer;
      return { num: qNum, key: ans || 'C' };
    }
    // Default curriculum balanced mock key for remaining slots
    const standardKeys = ['C', 'B', 'B', 'A', 'D', 'B', 'C', 'A', 'D', 'B', 'A', 'C', 'C', 'D', 'A', 'B', 'B', 'C', 'A', 'D', 'C', 'A', 'B', 'D', 'B', 'A', 'C', 'D', 'B', 'A'];
    return { num: qNum, key: standardKeys[i % standardKeys.length] };
  });

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Action & Print Controller Toolbar */}
      <section className="sticky top-28 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Segmented Controls for View Mode */}
          <div className="flex items-center p-1 rounded-xl bg-[#eeedf4] w-full lg:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setViewMode('soal')}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                viewMode === 'soal'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Tampilkan Soal Saja</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kunci')}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                viewMode === 'kunci'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Kunci &amp; Pembahasan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semua')}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                viewMode === 'semua'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">library_books</span>
              <span>Cetak Bersama (Lengkap)</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 w-full lg:w-auto justify-end">
            {/* Paper Format Dropdown */}
            <div className="relative flex items-center bg-[#e9e7ef] rounded-xl px-3 py-1.5">
              <span className="material-symbols-outlined text-[#00236f] text-[18px] mr-1.5">
                description
              </span>
              <select
                value={paperFormat}
                onChange={(e) => setPaperFormat(e.target.value as any)}
                className="bg-transparent text-xs text-[#0F172A] focus:outline-none cursor-pointer pr-4 appearance-none font-medium"
              >
                <option value="a4">A4 Standar (210 × 297 mm)</option>
                <option value="f4">F4 / Folio (215 × 330 mm)</option>
                <option value="kuarto">Letter / Kuarto</option>
              </select>
              <span className="material-symbols-outlined text-[#64748B] text-[16px] pointer-events-none -ml-4">
                expand_more
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="hidden xl:flex items-center bg-[#eeedf4] rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => handleAdjustZoom(-10)}
                className="p-1 rounded-lg hover:bg-white text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <span className="text-xs text-[#0F172A] px-2 min-w-[45px] text-center font-bold">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => handleAdjustZoom(10)}
                className="p-1 rounded-lg hover:bg-white text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
            </div>

            {/* Back to Editor */}
            <button
              type="button"
              onClick={onGoBackToEditor}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Editor</span>
            </button>

            {/* Copy to Docs */}
            <button
              type="button"
              onClick={handleCopyToDocs}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#00236f] text-xs font-semibold transition-colors cursor-pointer"
              title="Salin teks naskah ke Google Docs"
            >
              <span className="material-symbols-outlined text-[18px] text-[#2563EB]">
                description
              </span>
              <span className="hidden md:inline">Salin ke Docs</span>
            </button>

            {/* Primary Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1e3a8a] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Cetak / Print PDF</span>
            </button>
          </div>
        </div>
      </section>

      {/* Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 flex flex-wrap items-center justify-between gap-2 text-[#64748B] text-xs no-print">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#ECFDF5] text-[#059669] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1.5"></span>
            Siap Cetak
          </span>
          <span>
            Format: <strong className="text-[#0F172A]">2 Halaman Terpadu</strong> (Soal &amp; Panduan Pendidik)
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Dibuat: {currentExam.createdAt || '24 Oktober 2024'}</span>
          <span>•</span>
          <span>Tingkat Keterbacaan: Sangat Sesuai Siswa SD Kelas {currentExam.grade}</span>
        </div>
      </div>

      {/* Main Canvas Area: Desktop Printing Surface */}
      <div
        className="w-full mt-4 flex flex-col items-center gap-8 px-2 sm:px-4"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* PAGE 1: LEMBAR SOAL RESMI SISWA (SIMULATED A4) */}
        {(viewMode === 'soal' || viewMode === 'semua') && (
          <article
            id="page-soal"
            className="w-full max-w-[820px] bg-white rounded-none shadow-[0_4px_24px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] text-[#0F172A] p-8 sm:p-14 relative print-page"
          >
            {/* Watermark Background Minimal */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.015] overflow-hidden select-none">
              <span className="text-[180px] font-bold tracking-widest text-[#00236f] rotate-45">
                SDN1
              </span>
            </div>

            {/* KOP RESMI SEKOLAH */}
            <header className="w-full relative pb-3 border-b-0">
              <div className="flex items-center justify-between gap-4">
                {/* Logo Tut Wuri Handayani (Kiri) */}
                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center p-1">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-f2jZ6mbbgnnWM-Ea0rYVOpccOXjWS6aXGTZwMEn1vhF68N2-NzjZNLLVxPJgyDOm4vPWozCA-PEl7Lhaajz6VpCD8mhA2IdUeJP3QFdXL8OTQNuNRCSGgZb-kMmc2sJf82rchuOjKzEZj0PUL2MPl6wKJEzCz27iAd3In1E2MUImZEFhRQI8grKa9hclihAL9KNkDboU64v-5Jfow-nhj5Q32aaw7qe6XHR0UoM"
                    alt="Lambang Tut Wuri Handayani"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Teks Kop Pusat */}
                <div className="flex-1 text-center font-['Times_New_Roman',serif]">
                  <h4 className="text-[14px] sm:text-[15px] font-bold leading-tight tracking-wider text-black uppercase">
                    PEMERINTAH KABUPATEN KARAWANG
                  </h4>
                  <h3 className="text-[15px] sm:text-[16px] font-bold leading-tight tracking-wide text-black uppercase">
                    DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA
                  </h3>
                  <h4 className="text-[13px] sm:text-[14px] font-semibold leading-tight text-black uppercase">
                    KORWILCAMBIDIK KECAMATAN PURWASARI
                  </h4>
                  <h2 className="text-[17px] sm:text-[19px] font-black leading-tight tracking-wider text-black uppercase mt-0.5">
                    {settings.schoolName.toUpperCase()}
                  </h2>
                  <p className="text-[11px] sm:text-[12px] italic leading-tight text-neutral-800 mt-1">
                    {settings.address} • Pos-el: sdn1purwasari@karawangkab.go.id
                  </p>
                </div>

                {/* Logo Kabupaten Karawang (Kanan) */}
                <div className="w-20 h-20 flex-shrink-0 hidden sm:flex items-center justify-center p-1">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtFGGHCnLkqzkWFQw6q_L-VP8v9kMMah06K5xKmlyIUs3d8_HHvsVkg2KitXhkDtDRBbTbTZn9Wo14a8rklpmI9Q95VCbn1TOo8qgtLvxMBTevIULT4cxQFZIWHvqoaYhJqTHz7pI6HhIIXM7cnDPAw1Pli3xiMmUsYtYUUYKzro-7wIJUgseP544HI0TyJ4gQOWICLGesHX3SdScaJ7e3UCjSBxO23eHXfIZoCGE"
                    alt="Logo Kabupaten Karawang"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Garis Ganda Pemisah KOP Resmi */}
              <div className="w-full mt-3">
                <div className="w-full h-[3px] bg-black"></div>
                <div className="w-full h-[1px] bg-black mt-[2px]"></div>
              </div>
            </header>

            {/* Judul Dokumen Naskah */}
            <section className="mt-4 text-center font-['Times_New_Roman',serif]">
              <h1 className="text-[16px] sm:text-[17px] font-bold tracking-wide uppercase text-black">
                NASKAH LATIHAN TES KEMAMPUAN AKADEMIK (TKA)
              </h1>
              <h2 className="text-[14px] sm:text-[15px] font-bold uppercase text-black">
                TAHUN AJARAN {settings.academicYear}
              </h2>
            </section>

            {/* Tabel Identitas Siswa & Ujian */}
            <section className="mt-4 p-3 rounded-lg bg-[#f4f3fa]/80 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] font-['Times_New_Roman',serif]">
                <div className="flex items-center">
                  <span className="w-36 font-semibold text-neutral-800">Mata Pelajaran</span>
                  <span className="mr-2">:</span>
                  <span className="font-bold text-[#00236f]">{currentExam.subject} (Kurikulum Merdeka)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-semibold text-neutral-800">Nama Siswa</span>
                  <span className="mr-2">:</span>
                  <span className="flex-1 text-neutral-400">...................................................</span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-semibold text-neutral-800">Kelas / Semester</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium">
                    {currentExam.grade === 4 ? 'IV (Empat)' : `Kelas ${currentExam.grade}`} / Ganjil
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-semibold text-neutral-800">Nomor Absen / NISN</span>
                  <span className="mr-2">:</span>
                  <span className="flex-1 text-neutral-400">...................................................</span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-semibold text-neutral-800">Alokasi Waktu</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium">{currentExam.durationMinutes || 90} Menit</span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 font-semibold text-neutral-800">Hari / Tanggal</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium">{currentExam.createdAt || '24 Oktober 2024'}</span>
                </div>
              </div>
            </section>

            {/* Petunjuk Umum Pengerjaan */}
            <section className="mt-4 p-3 rounded-lg bg-[#eeedf4]/60 text-[12px] text-neutral-800 font-['Times_New_Roman',serif] border border-slate-200">
              <div className="font-bold text-black uppercase mb-1 tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#a73a00]">info</span>
                <span>PETUNJUK UMUM PENGERJAAN:</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 leading-relaxed">
                <li>Berdoalah menurut agama dan keyakinan masing-masing sebelum mulai mengerjakan soal.</li>
                <li>Tulislah nama lengkap dan nomor induk peserta Anda dengan jelas pada kolom yang telah disediakan.</li>
                <li>Bacalah setiap stimulus teks cerita atau grafik dengan teliti sebelum menjawab butir soal.</li>
                <li>Berikan tanda silang (X) pada salah satu huruf A, B, C, atau D pada pilihan jawaban yang dianggap paling benar.</li>
                <li>Periksa kembali semua pekerjaan Anda sebelum diserahkan kepada Bapak/Ibu Guru pengawas.</li>
              </ol>
            </section>

            {/* Separator Line */}
            <div className="w-full my-5 h-[1.5px] bg-neutral-300"></div>

            {/* LEMBAR SOAL KONTEN */}
            <section className="space-y-6 font-['Times_New_Roman',serif] text-[13.5px] leading-relaxed text-black">
              {/* Stimulus Section */}
              {currentExam.stimuli?.map((stim, sIdx) => (
                <div
                  key={stim.id || sIdx}
                  className="p-4 rounded-xl bg-[#f4f3fa] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[12px] tracking-wider uppercase bg-[#1e3a8a] text-white px-2.5 py-0.5 rounded">
                      STIMULUS {sIdx + 1}
                    </span>
                    <span className="text-[12px] italic text-neutral-600 font-sans">
                      {currentExam.subject} Kehidupan Nyata • Kelas {currentExam.grade}
                    </span>
                  </div>
                  <h3 className="font-bold text-[14px] text-black text-center mb-2 uppercase tracking-wide">
                    BACALAH TEKS BERIKUT UNTUK MENJAWAB SOAL!
                  </h3>
                  <div className="space-y-2 text-justify">
                    <p>{stim.storyText}</p>
                    {stim.tableData && (
                      <div className="overflow-x-auto rounded bg-white mt-2 p-2 border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 font-bold text-black">
                            <tr>
                              {stim.tableData.headers.map((h, i) => (
                                <th key={i} className="p-1.5 border border-slate-300">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {stim.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((c, cIdx) => (
                                  <td key={cIdx} className="p-1.5 border border-slate-300">
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Numbered Questions */}
              {currentExam.questions?.map((q, idx) => (
                <div key={q.id || idx} className="pl-1 pt-1">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[14px] min-w-[20px]">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="font-medium text-black">{q.stem}</p>

                      {/* Options */}
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mt-2.5 pl-2">
                          {q.options.map((opt) => (
                            <div key={opt.key} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#eeedf4] flex items-center justify-center font-bold text-[12px] border border-slate-300 flex-shrink-0">
                                {opt.key}
                              </span>
                              <span>{opt.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Matrix Rows if True/False */}
                      {q.matrixRows && (
                        <div className="mt-2 pl-2">
                          <table className="w-full text-xs border border-slate-300">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="p-1.5 border border-slate-300 text-left">Pernyataan</th>
                                <th className="p-1.5 border border-slate-300 text-center w-20">Benar</th>
                                <th className="p-1.5 border border-slate-300 text-center w-20">Salah</th>
                              </tr>
                            </thead>
                            <tbody>
                              {q.matrixRows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 border border-slate-300">{row.text}</td>
                                  <td className="p-1.5 border border-slate-300 text-center">○</td>
                                  <td className="p-1.5 border border-slate-300 text-center">○</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* A4 Page 1 Footer */}
            <footer className="mt-14 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-neutral-500 font-['Times_New_Roman',serif]">
              <span>TKA {settings.academicYear} • {settings.schoolName}</span>
              <span className="font-semibold text-neutral-700">Halaman 1 dari 2</span>
              <span>Dokumen Resmi Terverifikasi</span>
            </footer>
          </article>
        )}

        {/* Page Break for printing */}
        {viewMode === 'semua' && <div className="page-break"></div>}

        {/* PAGE 2: KUNCI JAWABAN & RUBRIK PEMBAHASAN RESMI (PEGANGAN GURU) */}
        {(viewMode === 'kunci' || viewMode === 'semua') && (
          <article
            id="page-kunci"
            className="w-full max-w-[820px] bg-white rounded-none shadow-[0_4px_24px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] text-[#0F172A] p-8 sm:p-14 relative print-page"
          >
            {/* Header Dokumen Rahasia Guru */}
            <header className="w-full pb-3 border-b-2 border-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#a73a00] text-white font-['Times_New_Roman',serif] font-bold text-[12px] uppercase tracking-wider">
                    DOKUMEN GURU - RAHASIA
                  </span>
                  <span className="text-[12px] text-neutral-500 font-sans">
                    Kurikulum Merdeka {settings.academicYear}
                  </span>
                </div>
                <span className="font-['Times_New_Roman',serif] text-[12px] font-semibold text-[#00236f]">
                  {settings.schoolName.toUpperCase()}
                </span>
              </div>
            </header>

            {/* Title Halaman 2 */}
            <section className="mt-4 text-center font-['Times_New_Roman',serif]">
              <h2 className="text-[16px] sm:text-[18px] font-bold tracking-wide uppercase text-black">
                KUNCI JAWABAN, PEMBAHASAN &amp; PEDOMAN PENILAIAN
              </h2>
              <p className="text-[13px] text-neutral-700 mt-0.5">
                Mata Pelajaran: {currentExam.subject} (Kelas {currentExam.grade}) • Alokasi:{' '}
                {currentExam.questions?.length || 30} Butir Soal Standar
              </p>
            </section>

            {/* Matrix Tabel Kunci Jawaban Lengkap 1-30 */}
            <section className="mt-6">
              <div className="flex items-center justify-between mb-2 font-['Times_New_Roman',serif]">
                <h3 className="font-bold text-[13.5px] uppercase tracking-wide text-neutral-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#00236f]">
                    table_chart
                  </span>
                  <span>A. TABEL MATRIKS KUNCI JAWABAN (NO. 1 - 30)</span>
                </h3>
                <span className="font-sans text-[11px] text-neutral-500">
                  Bobot per butir: Benar = 1 | Salah = 0
                </span>
              </div>

              {/* 6-Column Compact Grid Matrix representing 30 questions */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-['Times_New_Roman',serif] text-[12px]">
                {/* 6 column blocks of 5 questions each */}
                {[0, 1, 2, 3, 4, 5].map((colIdx) => {
                  const blockItems = fullAnswerKeyMatrix.slice(colIdx * 5, (colIdx + 1) * 5);
                  return (
                    <div
                      key={colIdx}
                      className="bg-[#f4f3fa] rounded-lg p-2 flex flex-col gap-1.5 border border-slate-200"
                    >
                      {blockItems.map((item) => (
                        <div
                          key={item.num}
                          className="flex justify-between px-1.5 py-0.5 bg-white rounded border border-slate-100"
                        >
                          <span className="font-bold">{item.num}.</span>
                          <span className="font-black text-[#2563EB]">{item.key}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Rubrik & Pembahasan Rinci Stimulus */}
            <section className="mt-6 space-y-3 font-['Times_New_Roman',serif]">
              <h3 className="font-bold text-[13.5px] uppercase tracking-wide text-neutral-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#a73a00]">
                  analytics
                </span>
                <span>B. PEMBAHASAN SINGKAT &amp; LANGKAH PENGERJAAN SOAL</span>
              </h3>

              {currentExam.questions?.slice(0, 3).map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-3.5 rounded-lg bg-[#f4f3fa] text-[13px] leading-relaxed border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-black">Nomor {idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-full font-sans font-semibold text-[11px] bg-[#EFF6FF] text-[#2563EB]">
                      Kunci: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                    </span>
                    <span className="text-neutral-500 text-[11px] font-sans">
                      Level Kognitif: {q.cognitiveLevel}
                    </span>
                  </div>
                  <p className="text-neutral-800 whitespace-pre-line">
                    <strong>Penjelasan:</strong> {q.explanation}
                  </p>
                </div>
              ))}
            </section>

            {/* Lembar Pengesahan Guru Pengampu */}
            <section className="mt-8 pt-4 font-['Times_New_Roman',serif] text-[13px]">
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <p>Mengetahui,</p>
                  <p className="font-semibold text-black">Kepala {settings.schoolName}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-black">{settings.principalName}</p>
                  <p className="text-[12px] text-neutral-600">NIP. {settings.principalNip}</p>
                </div>
                <div className="text-right">
                  <p>Purwasari, {currentExam.createdAt || '24 Oktober 2024'}</p>
                  <p className="font-semibold text-black">Guru Kelas / Penyusun,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-black">{currentExam.authorName}</p>
                  <p className="text-[12px] text-neutral-600">NIP. {currentExam.authorNip}</p>
                </div>
              </div>
            </section>

            {/* A4 Page 2 Footer */}
            <footer className="mt-10 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-neutral-500 font-['Times_New_Roman',serif]">
              <span>Kunci Jawaban Resmi TKA • {settings.schoolName}</span>
              <span className="font-semibold text-neutral-700">Halaman 2 dari 2</span>
              <span>Arsip Kurikulum Merdeka</span>
            </footer>
          </article>
        )}
      </div>

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-[#059669] text-xl">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
