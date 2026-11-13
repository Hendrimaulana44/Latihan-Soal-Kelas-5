import React, { useEffect, useState } from 'react';
import { ExamResult, ExamPackage } from '../types';
import confetti from 'canvas-confetti';

interface ExamResultViewProps {
  result: ExamResult;
  exam: ExamPackage;
  onGoBackToExam: () => void;
  onGoToDashboard: () => void;
  onOpenCertificateModal: () => void;
  onOpenSolutionsModal: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  exam,
  onGoBackToExam,
  onGoToDashboard,
  onOpenCertificateModal,
  onOpenSolutionsModal,
}) => {
  // Fire celebration confetti on result load
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00236f', '#2563EB', '#059669', '#a73a00', '#ffd700'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Top Utility Context Bar with Toggle Pill */}
      <div className="w-full bg-[#f4f3fa] py-2.5 px-4 rounded-xl flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 text-[#64748B] text-xs">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>Asesmen Terstandar Kemendikbudristek • SDN 1 Purwasari</span>
        </div>
        <div className="inline-flex p-1 bg-[#e9e7ef] rounded-full">
          <button
            type="button"
            onClick={onGoBackToExam}
            className="px-4 py-1 rounded-full text-xs font-semibold text-[#444651] hover:text-[#1a1b21] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Lembar Ujian Interaktif
          </button>
          <button
            type="button"
            className="px-4 py-1 rounded-full text-xs font-semibold bg-[#1e3a8a] text-white shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">insights</span>
            Hasil &amp; Analisis Siswa
          </button>
        </div>
      </div>

      {/* Top Result Banner */}
      <div className="bg-gradient-to-r from-[#00236f] via-[#1e3a8a] to-[#4059aa] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#ffdbce]/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#EFF6FF]/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-bold shadow-xs">
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>Asesmen Berhasil Diselesaikan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
              Selamat, {result.studentName.split(' ')[0]}!
            </h1>
            <p className="text-sm sm:text-base text-[#dce1ff] leading-relaxed">
              Kamu telah menyelesaikan seluruh rangkaian {result.examTitle} dengan capaian luar biasa.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[#dce1ff] text-xs">
              <span>• Waktu Selesai: {result.completionTimeMinutes} Menit</span>
              <span>• Tanggal: {result.date}</span>
              <span>• SDN 1 Purwasari</span>
            </div>
          </div>

          {/* Hero Score Badge */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-inner min-w-[240px] text-center border border-white/10">
            <span className="text-xs uppercase tracking-wider text-[#dce1ff] font-bold">
              Nilai Akhir Ujian
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-6xl font-black text-[#ffdbce] tracking-tighter">
                {result.finalScore}
              </span>
              <span className="text-lg text-[#dce1ff]">/ 100</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#059669] text-white text-xs font-bold shadow-sm">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span>{result.predicate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Score Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Metric Cards (Benar, Salah, Kosong) (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-full gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0F172A]">Rincian Jawaban Soal</h3>
              <span className="text-xs text-[#64748B]">30 Soal Teruji</span>
            </div>

            {/* Breakdown Visual Bar */}
            <div className="w-full h-3.5 bg-[#f4f3fa] rounded-full overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-[#059669] transition-all"
                style={{ width: `${(result.correctCount / 30) * 100}%` }}
                title={`Benar: ${result.correctCount}`}
              ></div>
              <div
                className="h-full bg-[#E11D48] transition-all"
                style={{ width: `${(result.incorrectCount / 30) * 100}%` }}
                title={`Salah: ${result.incorrectCount}`}
              ></div>
              <div
                className="h-full bg-slate-300 transition-all"
                style={{ width: `${(result.blankCount / 30) * 100}%` }}
                title={`Kosong: ${result.blankCount}`}
              ></div>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-[#ECFDF5] flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#059669] text-xl">check_circle</span>
                <span className="text-2xl text-[#059669] font-black my-0.5">
                  {result.correctCount}
                </span>
                <span className="text-[11px] text-[#059669] font-bold">Benar</span>
              </div>
              <div className="p-3 rounded-xl bg-red-50 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#E11D48] text-xl">cancel</span>
                <span className="text-2xl text-[#E11D48] font-black my-0.5">
                  {result.incorrectCount}
                </span>
                <span className="text-[11px] text-[#E11D48] font-bold">Salah</span>
              </div>
              <div className="p-3 rounded-xl bg-[#e9e7ef] flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#64748B] text-xl">
                  indeterminate_check_box
                </span>
                <span className="text-2xl text-[#64748B] font-black my-0.5">
                  {result.blankCount}
                </span>
                <span className="text-[11px] text-[#64748B] font-bold">Kosong</span>
              </div>
            </div>

            {/* Teacher's Note Card */}
            <div className="p-4 rounded-xl bg-[#EFF6FF] flex items-start gap-3 mt-1 border border-blue-100">
              <span className="material-symbols-outlined text-[#2563EB] text-2xl flex-shrink-0">
                record_voice_over
              </span>
              <div className="flex flex-col">
                <span className="text-xs text-[#00236f] font-bold">
                  Catatan Guru ({exam.authorName || 'Ibu Ratna Dewi, S.Pd.'})
                </span>
                <p className="text-xs text-[#444651] mt-1 leading-relaxed">
                  "{result.teacherNote}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Mastery Horizontal Bars (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-full gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Penguasaan Kompetensi Materi
                </h3>
                <span className="text-xs text-[#64748B]">
                  Tingkat keberhasilan indikator capaian pembelajaran
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold">
                Kurikulum Merdeka
              </span>
            </div>

            {/* Skill Bars */}
            <div className="flex flex-col gap-4">
              {result.competencyBreakdown?.map((comp, ci) => {
                const colors = [
                  { bar: 'bg-[#2563EB]', text: 'text-[#00236f]', icon: 'calculate' },
                  { bar: 'bg-[#a73a00]', text: 'text-[#a73a00]', icon: 'pie_chart' },
                  { bar: 'bg-[#D97706]', text: 'text-[#D97706]', icon: 'square_foot' },
                ];
                const c = colors[ci % colors.length];

                return (
                  <div key={ci} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#0F172A] font-semibold flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-base ${c.text}`}>
                          {c.icon}
                        </span>
                        {comp.domain}
                      </span>
                      <span className={`font-bold ${c.text}`}>{comp.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#f4f3fa] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${comp.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-[#059669] font-medium">{comp.note}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onOpenSolutionsModal}
                className="px-4 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#00236f] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">menu_book</span>
                <span>Lihat Pembahasan Lengkap</span>
              </button>
              <button
                type="button"
                onClick={onGoToDashboard}
                className="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#2563EB] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">home</span>
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Kid Gallery / Trophy Area */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#ffdbce] flex items-center justify-center text-[#a73a00] flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-3xl">workspace_premium</span>
          </div>
          <div className="flex flex-col">
            <h4 className="text-base font-bold text-[#0F172A]">Lencana Bintang Purwasari Diraih!</h4>
            <p className="text-xs text-[#64748B]">
              Farhan mendapatkan lencana penghargaan "Detektif Berhitung Cepat" atas akurasi hitung di atas 85%.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCertificateModal}
          className="px-4 py-2.5 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Unduh Sertifikat Nilai</span>
        </button>
      </div>
    </div>
  );
};
