import React from 'react';
import { ExamPackage, ExamResult } from '../types';

interface SolutionsModalProps {
  exam: ExamPackage;
  result?: ExamResult;
  onClose: () => void;
}

export const SolutionsModal: React.FC<SolutionsModalProps> = ({ exam, result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#0F172A]">
                Pembahasan Lengkap &amp; Langkah Pengerjaan
              </h3>
              <span className="text-xs text-[#64748B]">
                {exam.title} • {exam.curriculum}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          {exam.questions?.map((q, idx) => {
            const studentAns = result?.answers?.[q.number];
            const isCorrect = q.correctAnswer
              ? Array.isArray(q.correctAnswer)
                ? Array.isArray(studentAns) &&
                  studentAns.length === q.correctAnswer.length &&
                  studentAns.every((k) => (q.correctAnswer as string[]).includes(k))
                : studentAns === q.correctAnswer
              : false;

            return (
              <div
                key={q.id || idx}
                className="p-4 rounded-2xl bg-[#f4f3fa] border border-slate-200/80 flex flex-col gap-2.5 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900">
                      Level: {q.cognitiveLevel} • Bobot: {q.points || 1}
                    </span>
                  </div>
                  {result && (
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        isCorrect
                          ? 'bg-[#ECFDF5] text-[#059669]'
                          : 'bg-red-50 text-[#E11D48]'
                      }`}
                    >
                      {isCorrect ? '✓ Jawaban Siswa Benar' : '✕ Jawaban Siswa Kurang Tepat'}
                    </span>
                  )}
                </div>

                <p className="font-medium text-slate-900 leading-relaxed">{q.stem}</p>

                <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[#00236f] font-bold">
                    <span className="material-symbols-outlined text-base text-[#a73a00]">
                      key
                    </span>
                    <span>
                      Kunci Jawaban:{' '}
                      {Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.join(', ')
                        : q.correctAnswer}
                    </span>
                  </div>
                  <div className="text-slate-700 whitespace-pre-line leading-relaxed mt-1">
                    {q.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00236f] text-white text-xs font-bold cursor-pointer"
          >
            Tutup Pembahasan
          </button>
        </div>
      </div>
    </div>
  );
};
