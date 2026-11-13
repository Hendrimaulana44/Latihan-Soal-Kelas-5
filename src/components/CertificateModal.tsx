import React from 'react';
import { ExamResult, AppSettings } from '../types';

interface CertificateModalProps {
  result: ExamResult;
  settings: AppSettings;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  result,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a73a00]">workspace_premium</span>
            <span className="font-bold text-sm text-[#0F172A]">
              Piagam Penghargaan Prestasi Asesmen
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1e3a8a] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Cetak Piagam</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="mt-4 p-8 sm:p-12 rounded-2xl bg-[#faf8ff] border-4 border-double border-[#00236f] text-center flex flex-col items-center relative overflow-hidden shadow-inner font-['Times_New_Roman',serif]">
          {/* Subtle Decorative Corners */}
          <div className="absolute top-2 left-2 text-[#00236f] text-xl font-serif">✦</div>
          <div className="absolute top-2 right-2 text-[#00236f] text-xl font-serif">✦</div>
          <div className="absolute bottom-2 left-2 text-[#00236f] text-xl font-serif">✦</div>
          <div className="absolute bottom-2 right-2 text-[#00236f] text-xl font-serif">✦</div>

          <div className="w-16 h-16 rounded-full bg-[#ffdbce] flex items-center justify-center text-[#a73a00] mb-3 shadow-md">
            <span className="material-symbols-outlined text-3xl">military_tech</span>
          </div>

          <h4 className="text-xs font-bold tracking-widest text-[#00236f] uppercase">
            PEMERINTAH KABUPATEN KARAWANG • {settings.schoolName.toUpperCase()}
          </h4>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-wide uppercase mt-1">
            SERTIFIKAT PENGHARGAAN
          </h2>
          <p className="text-xs text-slate-600 italic mt-0.5">
            Diberikan sebagai bukti capaian kompetensi unggul pada Tes Kemampuan Akademik (TKA)
          </p>

          <div className="my-6">
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Dianugerahkan kepada:
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#00236f] underline decoration-[#a73a00] decoration-2 underline-offset-8 mt-1">
              {result.studentName}
            </div>
            <div className="text-xs text-slate-700 mt-2 font-mono">
              NISN: {result.studentNisn || '0129845721'} • {result.studentClass}
            </div>
          </div>

          <div className="max-w-md text-xs text-neutral-800 leading-relaxed">
            Atas keberhasilannya menuntaskan paket asesmen <strong>{result.examTitle}</strong> dengan
            memperoleh skor nilai akhir:
          </div>

          <div className="my-3 px-6 py-2 rounded-xl bg-white border border-[#2563EB]/40 shadow-xs inline-flex items-center gap-3">
            <span className="text-4xl font-black text-[#a73a00] font-sans">
              {result.finalScore}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">
                Predikat Capaian
              </span>
              <span className="text-xs font-bold text-[#059669] font-sans">
                {result.predicate}
              </span>
            </div>
          </div>

          <div className="w-full flex justify-between items-end mt-8 pt-4 border-t border-slate-300 text-xs">
            <div className="text-left">
              <div>Mengetahui,</div>
              <div className="font-bold">Kepala {settings.schoolName}</div>
              <div className="h-12"></div>
              <div className="font-bold underline">{settings.principalName}</div>
              <div className="text-[11px] text-slate-600">NIP. {settings.principalNip}</div>
            </div>
            <div className="text-right">
              <div>Purwasari, {result.date}</div>
              <div className="font-bold">Guru Pamong Asesmen</div>
              <div className="h-12"></div>
              <div className="font-bold underline">Ibu Ratna Dewi, S.Pd.</div>
              <div className="text-[11px] text-slate-600">NIP. 19850417 201101 2 009</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
