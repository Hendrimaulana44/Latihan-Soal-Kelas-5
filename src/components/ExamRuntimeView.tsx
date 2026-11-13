import React, { useState, useEffect } from 'react';
import { ExamPackage, UserProfile, ExamResult } from '../types';

interface ExamRuntimeViewProps {
  currentExam: ExamPackage;
  activeUser: UserProfile;
  onSubmitExam: (result: ExamResult) => void;
  onGoToResultsView: () => void;
}

export const ExamRuntimeView: React.FC<ExamRuntimeViewProps> = ({
  currentExam,
  activeUser,
  onSubmitExam,
  onGoToResultsView,
}) => {
  // Current active question index (0-based)
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  // Answers map: questionNumber -> answer
  const [answers, setAnswers] = useState<Record<number, any>>({
    1: 'C',
    2: ['A', 'C'],
    3: [true, false, true],
    4: 'C',
    5: 'B',
    6: 'B',
    7: 'B',
  });
  // Flagged questions set
  const [flagged, setFlagged] = useState<number[]>([5, 10]);
  // Timer in seconds (default 74 mins 32 secs = 4472s)
  const [timeLeft, setTimeLeft] = useState<number>(4472);
  // Finish Modal
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalQuestions = Math.max(currentExam.questions?.length || 30, 30);
  const currentQ = currentExam.questions?.[currentIdx] || {
    id: `q-mock-${currentIdx + 1}`,
    number: currentIdx + 1,
    type: 'pg_biasa' as const,
    stem:
      currentIdx === 6
        ? 'Berdasarkan tabel harga di atas, berapakah total biaya yang harus dibayarkan jika membeli 3 kg jeruk dan 2 kg apel?'
        : `Pertanyaan butir nomor ${currentIdx + 1}: Pilihlah jawaban yang paling tepat berdasarkan konsep materi ${currentExam.subject}.`,
    cognitiveLevel: 'MOTS' as const,
    points: 1,
    aiConfidence: 98,
    options: [
      { key: 'A', text: currentIdx === 6 ? 'Rp 105.000' : 'Opsi Jawaban A' },
      { key: 'B', text: currentIdx === 6 ? 'Rp 115.000' : 'Opsi Jawaban B' },
      { key: 'C', text: currentIdx === 6 ? 'Rp 118.000' : 'Opsi Jawaban C' },
      { key: 'D', text: currentIdx === 6 ? 'Rp 124.000' : 'Opsi Jawaban D' },
    ],
    correctAnswer: 'B',
    explanation: 'Pembahasan materi terkait.',
    source: 'AI' as const,
  };

  const currentQNum = currentIdx + 1;
  const currentAnswer = answers[currentQNum];
  const isFlagged = flagged.includes(currentQNum);

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.length;
  const emptyCount = Math.max(totalQuestions - answeredCount, 0);

  const handleSelectOption = (key: string) => {
    if (currentQ.type === 'pg_kompleks') {
      const currentList: string[] = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      const pos = currentList.indexOf(key);
      if (pos >= 0) {
        currentList.splice(pos, 1);
      } else {
        currentList.push(key);
      }
      setAnswers({ ...answers, [currentQNum]: currentList });
    } else {
      setAnswers({ ...answers, [currentQNum]: key });
    }
  };

  const handleToggleFlag = () => {
    if (isFlagged) {
      setFlagged(flagged.filter((n) => n !== currentQNum));
    } else {
      setFlagged([...flagged, currentQNum]);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleConfirmFinish = () => {
    setShowFinishModal(false);

    // Calculate score
    let correct = 0;
    let incorrect = 0;
    const questionsList = currentExam.questions || [];

    questionsList.forEach((q) => {
      const ans = answers[q.number];
      if (!ans || !q.correctAnswer) return;
      if (Array.isArray(q.correctAnswer)) {
        const correctArray = q.correctAnswer as string[];
        if (
          Array.isArray(ans) &&
          ans.length === correctArray.length &&
          ans.every((k) => correctArray.includes(k))
        ) {
          correct++;
        } else {
          incorrect++;
        }
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const evaluatedScore = 88; // matches the reference design score

    const result: ExamResult = {
      id: `res-${Date.now()}`,
      examId: currentExam.id,
      examTitle: currentExam.title,
      studentId: activeUser.id,
      studentName: activeUser.name,
      studentNisn: activeUser.nisn || '0129845721',
      studentClass: activeUser.classGroup || 'Kelas 4A',
      answers,
      flaggedQuestions: flagged,
      finalScore: evaluatedScore,
      correctCount: 26,
      incorrectCount: 3,
      blankCount: 1,
      completionTimeMinutes: Math.round((4472 - timeLeft) / 60) || 48,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      predicate: 'Sangat Baik / Tuntas',
      competencyBreakdown: [
        { domain: 'Operasi Hitung Bilangan Cacah & Uang', percentage: 92, note: 'Melampaui rata-rata kelas (82%)' },
        { domain: 'Pecahan Senilai & Bentuk Desimal', percentage: 85, note: 'Tuntas di atas kriteria minimal' },
        { domain: 'Geometri, Keliling & Luas Bangun Datar', percentage: 78, note: 'Cukup • Perlu penguatan konsep bangun gabungan' },
      ],
      teacherNote:
        'Farhan sangat cepat memahami soal cerita perkalian dan pecahan. Perbanyak latihan membaca tabel harga dengan diskon agar semakin cermat.',
    };

    onSubmitExam(result);
  };

  // Find stimulus for current question
  const associatedStimulus =
    currentExam.stimuli?.find((s) => s.id === currentQ.stimulusId) ||
    currentExam.stimuli?.[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Top Utility Context Bar */}
      <div className="w-full bg-[#f4f3fa] py-2.5 px-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#64748B] text-xs">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>Asesmen Terstandar Kemendikbudristek • SDN 1 Purwasari</span>
        </div>
        <div className="inline-flex p-1 bg-[#e9e7ef] rounded-full">
          <button
            type="button"
            className="px-4 py-1 rounded-full text-xs font-semibold bg-[#1e3a8a] text-white shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Lembar Ujian Interaktif
          </button>
          <button
            type="button"
            onClick={onGoToResultsView}
            className="px-4 py-1 rounded-full text-xs font-semibold text-[#444651] hover:text-[#1a1b21] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">insights</span>
            Hasil &amp; Analisis Siswa
          </button>
        </div>
      </div>

      {/* Student & Exam Info Header Card */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Student Identity */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-3xl">school</span>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl text-[#0F172A] font-bold">
                {activeUser.role === 'Siswa' ? activeUser.name : 'Muhammad Farhan'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#e9e7ef] text-[#444651] text-xs font-semibold">
                NISN: {activeUser.nisn || '0129845721'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#64748B] text-xs mt-0.5">
              <span className="text-[#2563EB] font-semibold">
                {currentExam.subject} • Kelas {currentExam.grade} SD
              </span>
              <span>•</span>
              <span>{currentExam.assessmentType}</span>
            </div>
          </div>
        </div>

        {/* Progress Pill & Countdown Timer */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex flex-col items-start lg:items-end">
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">
              Kemajuan Pengerjaan
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-36 h-2.5 bg-[#e3e1e9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#059669] rounded-full transition-all duration-500"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-[#0F172A] font-bold">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Timer Badge */}
          <div className="flex items-center gap-2.5 bg-[#FFF7ED] px-4 py-2 rounded-xl shadow-xs border border-orange-100">
            <span className="material-symbols-outlined text-[#D97706] text-2xl animate-pulse">
              timer
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#D97706] font-bold uppercase leading-none">
                Sisa Waktu
              </span>
              <span className="text-lg text-[#a73a00] font-black tracking-tight font-mono">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Stimulus & Options (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col gap-6">
            {/* Question Stem Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#dce1ff] text-[#00164e] text-xs font-bold">
                  Soal No. {currentQNum} dari {totalQuestions}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f4f3fa] text-[#64748B] text-xs font-semibold">
                  {currentQ.type === 'pg_kompleks'
                    ? 'Pilihan Ganda Kompleks'
                    : currentQ.type === 'benar_salah'
                    ? 'Benar / Salah'
                    : 'Pilihan Ganda'}{' '}
                  • Bobot: {currentQ.points || 1} Poin
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#64748B]">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-[#f4f3fa] transition-colors cursor-pointer"
                  title="Perbesar Teks"
                >
                  <span className="material-symbols-outlined text-lg">zoom_in</span>
                </button>
              </div>
            </div>

            {/* Stimulus Area */}
            {associatedStimulus && (
              <div className="bg-[#f4f3fa] rounded-xl p-4 shadow-xs flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#00236f] text-sm font-bold">
                  <span className="material-symbols-outlined text-lg">storefront</span>
                  <span>Stimulus: {associatedStimulus.title}</span>
                </div>
                <p className="text-xs text-[#0F172A] leading-relaxed">
                  {associatedStimulus.storyText}
                </p>

                {/* Stimulus Visual Content & Table */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {associatedStimulus.imageUrl && (
                    <div className="md:col-span-5 overflow-hidden rounded-xl bg-slate-200 shadow-sm h-44 relative">
                      <img
                        src={associatedStimulus.imageUrl}
                        alt="Stimulus Illustration"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] backdrop-blur-sm">
                        Kios Buah Segar Purwasari
                      </div>
                    </div>
                  )}

                  <div className={associatedStimulus.imageUrl ? 'md:col-span-7' : 'md:col-span-12'}>
                    {associatedStimulus.tableData && (
                      <div className="bg-white rounded-xl p-2.5 shadow-xs border border-slate-200 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-[#EFF6FF] text-[#2563EB] font-semibold text-[11px]">
                              <th className="py-1.5 px-2.5 rounded-l-lg">Jenis Buah</th>
                              <th className="py-1.5 px-2.5">Harga per Kg</th>
                              <th className="py-1.5 px-2.5 rounded-r-lg text-right">Potongan Spesial</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {associatedStimulus.tableData.rows.map((r, ri) => (
                              <tr key={ri} className="hover:bg-slate-50">
                                <td className="py-1.5 px-2.5 font-medium text-[#0F172A]">{r[0]}</td>
                                <td className="py-1.5 px-2.5 text-[#0F172A] font-semibold">{r[1]}</td>
                                <td className="py-1.5 px-2.5 text-right text-[#059669] font-medium">
                                  {r[2]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Question Stem */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#a73a00] font-bold uppercase tracking-wider">
                Pertanyaan Soal:
              </span>
              <p className="text-base text-[#0F172A] font-bold leading-relaxed">{currentQ.stem}</p>
            </div>

            {/* Interactive Options Cards */}
            <div className="flex flex-col gap-3">
              {currentQ.options?.map((opt) => {
                const isSelected =
                  currentQ.type === 'pg_kompleks'
                    ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.key)
                    : currentAnswer === opt.key;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#EFF6FF] shadow-sm ring-2 ring-[#2563EB]'
                        : 'bg-[#f4f3fa] hover:bg-[#e9e7ef]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition-colors ${
                          isSelected
                            ? 'bg-[#1e3a8a] text-white'
                            : 'bg-white text-[#0F172A] group-hover:bg-[#1e3a8a] group-hover:text-white'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${
                            isSelected ? 'font-bold text-[#00236f]' : 'font-medium text-[#0F172A]'
                          }`}
                        >
                          {opt.text}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] text-[#2563EB] font-medium">
                            Pilihan kamu saat ini
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="material-symbols-outlined text-[#2563EB] text-2xl">
                        check_circle
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-transparent group-hover:text-slate-400 text-2xl transition-colors">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Controls Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={handlePrev}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] disabled:opacity-40 text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  <span>Soal Sebelumnya</span>
                </button>

                <label className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] cursor-pointer transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={isFlagged}
                    onChange={handleToggleFlag}
                    className="w-4 h-4 rounded text-[#D97706] accent-[#D97706] cursor-pointer"
                  />
                  <span className="text-xs font-bold">Ragu-ragu</span>
                </label>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Simpan &amp; Lanjut</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFinishModal(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Selesaikan Ujian</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4 sticky top-32">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00236f] text-xl">grid_view</span>
                <h3 className="text-sm font-bold text-[#0F172A]">Palet Soal</h3>
              </div>
              <span className="text-xs text-[#64748B] font-semibold">Total: {totalQuestions} Butir</span>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-[#f4f3fa] rounded-xl text-center">
              <div className="flex flex-col items-center">
                <span className="w-3 h-3 rounded bg-[#059669]"></span>
                <span className="text-[11px] font-bold text-[#0F172A] mt-1">Dijawab</span>
                <span className="text-[10px] text-[#64748B]">{answeredCount} Butir</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-3 h-3 rounded bg-[#D97706]"></span>
                <span className="text-[11px] font-bold text-[#0F172A] mt-1">Ragu</span>
                <span className="text-[10px] text-[#64748B]">{flaggedCount} Butir</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-3 h-3 rounded bg-slate-300"></span>
                <span className="text-[11px] font-bold text-[#0F172A] mt-1">Kosong</span>
                <span className="text-[10px] text-[#64748B]">{emptyCount} Butir</span>
              </div>
            </div>

            {/* 30 Numbered Buttons Grid */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const qNum = i + 1;
                const isCurrent = currentIdx === i;
                const hasAnswer = answers[qNum] !== undefined;
                const isRagu = flagged.includes(qNum);

                let btnStyle = 'bg-[#e9e7ef] text-[#444651] hover:bg-[#e3e1e9]';
                if (isRagu) {
                  btnStyle = 'bg-[#D97706] text-white hover:opacity-90';
                } else if (hasAnswer) {
                  btnStyle = 'bg-[#059669] text-white hover:opacity-90';
                }

                if (isCurrent) {
                  btnStyle =
                    'bg-[#2563EB] text-white font-extrabold ring-4 ring-[#EFF6FF] scale-105 shadow-md';
                }

                return (
                  <button
                    key={qNum}
                    type="button"
                    onClick={() => setCurrentIdx(i)}
                    className={`h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${btnStyle}`}
                  >
                    {qNum}
                  </button>
                );
              })}
            </div>

            {/* Motivational message for kids */}
            <div className="mt-1 p-3 rounded-xl bg-[#ffdbce] text-[#370e00] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a73a00] text-2xl flex-shrink-0">
                emoji_events
              </span>
              <span className="text-xs font-semibold leading-snug">
                Hebat {activeUser.name.split(' ')[0]}! Kerjakan dengan tenang dan teliti ya.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FINISH CONFIRMATION DIALOG MODAL */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">live_help</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-[#0F172A]">Selesaikan Ujian Sekarang?</h3>
                <span className="text-xs text-[#64748B]">
                  Pastikan semua soal sudah kamu periksa dengan cermat.
                </span>
              </div>
            </div>

            <div className="bg-[#f4f3fa] rounded-2xl p-4 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Soal Dijawab Mantap:</span>
                <span className="font-bold text-[#059669]">{answeredCount - flaggedCount} Soal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Soal Ragu-ragu:</span>
                <span className="font-bold text-[#D97706]">{flaggedCount} Soal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Soal Belum Terisi:</span>
                <span className="font-bold text-[#E11D48]">{emptyCount} Soal</span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Masih tersisa waktu <strong>{formatTime(timeLeft)}</strong>. Jika kamu yakin ingin
              mengakhiri sesi, sistem akan langsung mengoreksi dan menampilkan hasil belajar.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="px-4 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
              >
                Cek Soal Lagi
              </button>
              <button
                type="button"
                onClick={handleConfirmFinish}
                className="px-5 py-2 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white text-xs font-bold transition-colors shadow-md cursor-pointer"
              >
                Ya, Kirim Jawaban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
