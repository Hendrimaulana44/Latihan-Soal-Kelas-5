import React, { useState } from 'react';
import { Question, QuestionType, CognitiveLevel, Stimulus } from '../types';

interface QuestionModalProps {
  initialQuestion?: Question | null;
  stimuli: Stimulus[];
  defaultStimulusId?: string;
  totalQuestionsSoFar: number;
  onSave: (question: Question) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  initialQuestion,
  stimuli,
  defaultStimulusId,
  totalQuestionsSoFar,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialQuestion);

  const [type, setType] = useState<QuestionType>(initialQuestion?.type || 'pg_biasa');
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>(
    initialQuestion?.cognitiveLevel || 'MOTS'
  );
  const [points, setPoints] = useState<number>(initialQuestion?.points || 1);
  const [stimulusId, setStimulusId] = useState<string>(
    initialQuestion?.stimulusId || defaultStimulusId || stimuli[0]?.id || ''
  );
  const [stem, setStem] = useState<string>(initialQuestion?.stem || '');

  // Options for single or multiple choice
  const [optA, setOptA] = useState(
    initialQuestion?.options?.find((o) => o.key === 'A')?.text || ''
  );
  const [optB, setOptB] = useState(
    initialQuestion?.options?.find((o) => o.key === 'B')?.text || ''
  );
  const [optC, setOptC] = useState(
    initialQuestion?.options?.find((o) => o.key === 'C')?.text || ''
  );
  const [optD, setOptD] = useState(
    initialQuestion?.options?.find((o) => o.key === 'D')?.text || ''
  );

  // Correct answer
  const [singleCorrect, setSingleCorrect] = useState<string>(
    typeof initialQuestion?.correctAnswer === 'string' ? initialQuestion.correctAnswer : 'A'
  );
  const [multiCorrect, setMultiCorrect] = useState<string[]>(
    Array.isArray(initialQuestion?.correctAnswer) ? initialQuestion.correctAnswer : ['A']
  );

  // True/false matrix rows
  const [matrixRow1, setMatrixRow1] = useState(
    initialQuestion?.matrixRows?.[0]?.text || 'Pernyataan evaluasi 1'
  );
  const [matrixBool1, setMatrixBool1] = useState(
    initialQuestion?.matrixRows?.[0]?.correctBool ?? true
  );
  const [matrixRow2, setMatrixRow2] = useState(
    initialQuestion?.matrixRows?.[1]?.text || 'Pernyataan evaluasi 2'
  );
  const [matrixBool2, setMatrixBool2] = useState(
    initialQuestion?.matrixRows?.[1]?.correctBool ?? false
  );
  const [matrixRow3, setMatrixRow3] = useState(
    initialQuestion?.matrixRows?.[2]?.text || 'Pernyataan evaluasi 3'
  );
  const [matrixBool3, setMatrixBool3] = useState(
    initialQuestion?.matrixRows?.[2]?.correctBool ?? true
  );

  const [explanation, setExplanation] = useState<string>(
    initialQuestion?.explanation || 'Langkah penjelasan dan rubrik pengerjaan soal.'
  );

  const handleToggleMulti = (key: string) => {
    if (multiCorrect.includes(key)) {
      setMultiCorrect(multiCorrect.filter((k) => k !== key));
    } else {
      setMultiCorrect([...multiCorrect, key]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stem.trim()) return;

    const updated: Question = {
      id: initialQuestion?.id || `q-${Date.now()}`,
      number: initialQuestion?.number || totalQuestionsSoFar + 1,
      stimulusId: stimulusId || undefined,
      type,
      stem,
      cognitiveLevel,
      points,
      aiConfidence: initialQuestion?.aiConfidence || 99,
      source: 'manual',
      explanation,
      options:
        type === 'pg_biasa' || type === 'pg_kompleks'
          ? [
              { key: 'A', text: optA || 'Opsi A' },
              { key: 'B', text: optB || 'Opsi B' },
              { key: 'C', text: optC || 'Opsi C' },
              { key: 'D', text: optD || 'Opsi D' },
            ]
          : undefined,
      correctAnswer: type === 'pg_kompleks' ? multiCorrect : singleCorrect,
      matrixRows:
        type === 'benar_salah'
          ? [
              { text: matrixRow1, correctBool: matrixBool1 },
              { text: matrixRow2, correctBool: matrixBool2 },
              { text: matrixRow3, correctBool: matrixBool3 },
            ]
          : undefined,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">edit_note</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#0F172A]">
                {isEditing ? 'Edit Butir Soal' : 'Tambah Soal Manual'}
              </h3>
              <span className="text-xs text-[#64748B]">
                Editor Butir Soal TKA Guru SDN 1 Purwasari
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
          {/* Row 1: Type, Level, Stimulus */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Tipe Soal</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs font-medium text-[#0F172A] border border-slate-200 focus:outline-none"
              >
                <option value="pg_biasa">Pilihan Ganda Tunggal</option>
                <option value="pg_kompleks">Pilihan Ganda Kompleks</option>
                <option value="benar_salah">Matriks Benar / Salah</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Level Kognitif</label>
              <select
                value={cognitiveLevel}
                onChange={(e) => setCognitiveLevel(e.target.value as CognitiveLevel)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs font-medium text-[#0F172A] border border-slate-200 focus:outline-none"
              >
                <option value="LOTS">LOTS (Mudah)</option>
                <option value="MOTS">MOTS (Sedang)</option>
                <option value="HOTS">HOTS (Sukar)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Bobot Poin</label>
              <input
                type="number"
                min="1"
                max="5"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Stimulus Association */}
          {stimuli.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-700">Tautkan ke Stimulus</label>
              <select
                value={stimulusId}
                onChange={(e) => setStimulusId(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs font-medium text-[#0F172A] border border-slate-200 focus:outline-none"
              >
                <option value="">Tanpa Stimulus (Soal Berdiri Sendiri)</option>
                {stimuli.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    Stimulus {idx + 1}: {s.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Question Stem Text */}
          <div>
            <label className="text-xs font-semibold text-slate-700">Pertanyaan Soal</label>
            <textarea
              rows={3}
              required
              value={stem}
              onChange={(e) => setStem(e.target.value)}
              placeholder="Tuliskan pertanyaan soal secara jelas..."
              className="w-full mt-1 p-3 rounded-xl bg-white text-xs text-[#0F172A] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 leading-relaxed"
            />
          </div>

          {/* Options for Multiple Choice */}
          {(type === 'pg_biasa' || type === 'pg_kompleks') && (
            <div className="flex flex-col gap-2.5 bg-[#f4f3fa] p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-[#0F172A]">
                Pilihan Jawaban &amp; Kunci ({type === 'pg_kompleks' ? 'Pilih > 1' : 'Pilih 1'})
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'A', val: optA, set: setOptA },
                  { key: 'B', val: optB, set: setOptB },
                  { key: 'C', val: optC, set: setOptC },
                  { key: 'D', val: optD, set: setOptD },
                ].map((item) => {
                  const isChecked =
                    type === 'pg_kompleks'
                      ? multiCorrect.includes(item.key)
                      : singleCorrect === item.key;

                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          type === 'pg_kompleks'
                            ? handleToggleMulti(item.key)
                            : setSingleCorrect(item.key)
                        }
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 cursor-pointer ${
                          isChecked
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-white text-slate-700 border border-slate-300'
                        }`}
                      >
                        {item.key}
                      </button>
                      <input
                        type="text"
                        placeholder={`Teks Opsi ${item.key}`}
                        value={item.val}
                        onChange={(e) => item.set(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                      />
                      {isChecked && (
                        <span className="text-[10px] font-bold text-[#2563EB] bg-white px-2 py-1 rounded">
                          Kunci [✓]
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* True / False Matrix */}
          {type === 'benar_salah' && (
            <div className="flex flex-col gap-2.5 bg-[#f4f3fa] p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-[#0F172A]">Daftar Pernyataan Matriks</span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">1.</span>
                  <input
                    type="text"
                    value={matrixRow1}
                    onChange={(e) => setMatrixRow1(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setMatrixBool1(!matrixBool1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      matrixBool1 ? 'bg-[#059669] text-white' : 'bg-[#E11D48] text-white'
                    }`}
                  >
                    {matrixBool1 ? 'Benar' : 'Salah'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">2.</span>
                  <input
                    type="text"
                    value={matrixRow2}
                    onChange={(e) => setMatrixRow2(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setMatrixBool2(!matrixBool2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      matrixBool2 ? 'bg-[#059669] text-white' : 'bg-[#E11D48] text-white'
                    }`}
                  >
                    {matrixBool2 ? 'Benar' : 'Salah'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">3.</span>
                  <input
                    type="text"
                    value={matrixRow3}
                    onChange={(e) => setMatrixRow3(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setMatrixBool3(!matrixBool3)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      matrixBool3 ? 'bg-[#059669] text-white' : 'bg-[#E11D48] text-white'
                    }`}
                  >
                    {matrixBool3 ? 'Benar' : 'Salah'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Pembahasan Langkah &amp; Rubrik Solusi
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-white text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white text-xs font-bold cursor-pointer"
            >
              Simpan Soal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
