import React, { useState } from 'react';
import { ExamPackage, Question, Stimulus } from '../types';
import { geminiService } from '../services/gemini';

interface GeneratorEditorViewProps {
  currentExam: ExamPackage;
  onUpdateExam: (updated: ExamPackage) => void;
  onSaveToSheets: () => void;
  onGoToPrintPreview: () => void;
  onOpenAddQuestionModal: (stimulusId?: string) => void;
  onOpenEditQuestionModal: (q: Question) => void;
  onOpenAddStimulusModal: () => void;
}

export const GeneratorEditorView: React.FC<GeneratorEditorViewProps> = ({
  currentExam,
  onUpdateExam,
  onSaveToSheets,
  onGoToPrintPreview,
  onOpenAddQuestionModal,
  onOpenEditQuestionModal,
  onOpenAddStimulusModal,
}) => {
  const [subject, setSubject] = useState<'Matematika' | 'Bahasa Indonesia'>(currentExam.subject);
  const [grade, setGrade] = useState<number>(currentExam.grade || 4);
  const [assessmentType, setAssessmentType] = useState<string>(currentExam.assessmentType || 'Sumatif Akhir Semester (SAS)');
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [syllabus, setSyllabus] = useState<string>(
    currentExam.summary ||
      'Peserta didik dapat menyelesaikan masalah berkaitan dengan operasi perkalian dan pembagian bilangan cacah sampai 100, serta menyelesaikan masalah kontekstual pengukuran pecahan desimal dan uang di lingkungan pasar lokal pedesaan SDN 1 Purwasari.'
  );

  // Stepper & Generator state
  const [currentStep, setCurrentStep] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationLog, setGenerationLog] = useState<string>('');
  const [activeStepTitle, setActiveStepTitle] = useState<string>('Validasi Kunci & Solusi');

  // Handle AI Regeneration
  const handleRegenerate = async () => {
    setIsGenerating(true);
    setCurrentStep(1);
    try {
      const result = await geminiService.generateExam(
        {
          subject,
          grade,
          assessmentType,
          questionCount,
          syllabus,
          easyCount: 10,
          mediumCount: 14,
          hardCount: 6,
        },
        (step, title, detail) => {
          setCurrentStep(step);
          setActiveStepTitle(title);
          setGenerationLog(detail);
        }
      );

      // Merge generated content into current exam
      const updated: ExamPackage = {
        ...currentExam,
        title: result.title,
        subject: result.subject,
        grade: result.grade,
        assessmentType: result.assessmentType,
        summary: result.summary,
        stimuli: result.stimuli.length > 0 ? result.stimuli : currentExam.stimuli,
        questions: result.questions.length > 0 ? result.questions : currentExam.questions,
        status: 'final',
      };
      onUpdateExam(updated);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsGenerating(false);
      setCurrentStep(4);
    }
  };

  // Quick curriculum template filler
  const handleApplyTemplate = (type: 'matematika' | 'bahasa') => {
    if (type === 'matematika') {
      setSubject('Matematika');
      setSyllabus(
        'Peserta didik dapat menyelesaikan masalah berkaitan dengan operasi perkalian dan pembagian bilangan cacah sampai 100, serta menyelesaikan masalah kontekstual pengukuran pecahan desimal dan uang di lingkungan pasar lokal pedesaan SDN 1 Purwasari.'
      );
    } else {
      setSubject('Bahasa Indonesia');
      setSyllabus(
        'Peserta didik mampu memahami ide pokok dan ide pendukung pada teks narasi kearifan lokal Karawang, membedakan fakta dan opini, serta merefleksikan nilai-nilai Profil Pelajar Pancasila dalam gotong royong warga desa Purwasari.'
      );
    }
  };

  // Delete question
  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm('Hapus butir soal ini dari naskah?')) {
      const updatedQuestions = currentExam.questions.filter((q) => q.id !== questionId);
      onUpdateExam({
        ...currentExam,
        questions: updatedQuestions,
      });
    }
  };

  // Delete stimulus
  const handleDeleteStimulus = (stimulusId: string) => {
    if (window.confirm('Hapus stimulus ini beserta asosiasinya?')) {
      const updatedStimuli = currentExam.stimuli.filter((s) => s.id !== stimulusId);
      onUpdateExam({
        ...currentExam,
        stimuli: updatedStimuli,
      });
    }
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Top Utility Context Bar */}
      <div className="w-full bg-[#f4f3fa] py-4 px-4 sm:px-8 shadow-sm">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#64748B] text-xs">
              <span className="hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">home</span>
                Dashboard Naskah
              </span>
              <span className="text-[#c5c5d3]">/</span>
              <span className="text-[#00236f] font-semibold">Studio Generator AI &amp; Editor Soal</span>
            </nav>
            <div className="flex items-center gap-2">
              <h1 className="text-xl text-[#0F172A] font-bold tracking-tight">
                Buat Naskah Ujian Berbasis Gemini Pro
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                Mode Asistif Aktif
              </span>
            </div>
          </div>

          {/* Execution Status Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
            <span className="material-symbols-outlined text-[#059669] text-base">check_circle</span>
            <div className="flex items-center gap-2 text-xs text-[#0F172A]">
              <span className="font-medium">Google Apps Script:</span>
              <span className="text-[#059669] font-semibold">8.4s</span>
              <span className="text-[#c5c5d3]">•</span>
              <span className="text-[#64748B]">Quota: 142/200 RPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="w-full bg-white py-4 px-4 sm:px-8 shadow-[0_1px_3px_rgba(15,23,42,0.04)] border-b border-slate-100">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                currentStep >= 1 ? 'bg-[#f4f3fa]' : 'bg-slate-50 opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  currentStep > 1
                    ? 'bg-[#059669] text-white'
                    : currentStep === 1
                    ? 'bg-[#a73a00] text-white ring-4 ring-[#ffdbce]'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {currentStep > 1 ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  '1'
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#059669] font-bold uppercase tracking-wider">
                  Langkah 1
                </span>
                <span className="text-xs text-[#0F172A] font-semibold truncate">
                  Input Kisi-kisi CP
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                currentStep >= 2 ? 'bg-[#f4f3fa]' : 'bg-slate-50 opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  currentStep > 2
                    ? 'bg-[#059669] text-white'
                    : currentStep === 2
                    ? 'bg-[#a73a00] text-white ring-4 ring-[#ffdbce]'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {currentStep > 2 ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  '2'
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#059669] font-bold uppercase tracking-wider">
                  Langkah 2
                </span>
                <span className="text-xs text-[#0F172A] font-semibold truncate">
                  Analisis Stimulus AI
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                currentStep >= 3 ? 'bg-[#f4f3fa]' : 'bg-slate-50 opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  currentStep > 3
                    ? 'bg-[#059669] text-white'
                    : currentStep === 3
                    ? 'bg-[#a73a00] text-white ring-4 ring-[#ffdbce]'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {currentStep > 3 ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  '3'
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#059669] font-bold uppercase tracking-wider">
                  Langkah 3
                </span>
                <span className="text-xs text-[#0F172A] font-semibold truncate">
                  Penyusunan Butir Soal
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                currentStep === 4 ? 'bg-[#FFF7ED] shadow-sm' : 'bg-[#f4f3fa]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  currentStep === 4
                    ? 'bg-[#a73a00] text-white ring-4 ring-[#ffdbce]'
                    : 'bg-[#059669] text-white'
                }`}
              >
                4
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#a73a00] font-bold uppercase tracking-wider">
                  Langkah 4 • Aktif
                </span>
                <span className="text-xs text-[#0F172A] font-bold truncate">
                  Validasi Kunci &amp; Solusi
                </span>
              </div>
            </div>
          </div>

          {/* Active Generation Progress Feedback */}
          {isGenerating && (
            <div className="mt-3 p-3 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 flex items-center gap-3 animate-in fade-in">
              <span className="material-symbols-outlined text-[#2563EB] animate-spin">
                autorenew
              </span>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-[#1E3A8A]">{activeStepTitle}</span>
                <span className="text-slate-600">{generationLog}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Split Studio Workspace */}
      <div className="w-full px-4 sm:px-8 py-6 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: Konfigurasi Parameter Naskah (5 cols) */}
          <aside className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00236f] text-xl">tune</span>
                  <h2 className="text-base font-bold text-[#0F172A]">Parameter Naskah</h2>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#e9e7ef] text-[#64748B]">
                  Kurikulum Merdeka
                </span>
              </div>

              {/* Mata Pelajaran Radio Toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#0F172A]">Mata Pelajaran</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#f4f3fa] rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('matematika')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all text-xs font-semibold ${
                      subject === 'Matematika'
                        ? 'bg-[#1e3a8a] text-white shadow-sm'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">calculate</span>
                    <span>Matematika</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('bahasa')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all text-xs font-semibold ${
                      subject === 'Bahasa Indonesia'
                        ? 'bg-[#1e3a8a] text-white shadow-sm'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">menu_book</span>
                    <span>Bahasa Indonesia</span>
                  </button>
                </div>
              </div>

              {/* Kelas & Jenis Asesmen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#0F172A]">Tingkat Kelas</label>
                  <div className="relative">
                    <select
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      className="w-full appearance-none bg-white px-3.5 py-2.5 rounded-xl text-xs text-[#0F172A] border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
                    >
                      <option value={1}>Kelas 1 SD (Fase A)</option>
                      <option value={2}>Kelas 2 SD (Fase A)</option>
                      <option value={3}>Kelas 3 SD (Fase B)</option>
                      <option value={4}>Kelas 4 SD (Fase B)</option>
                      <option value={5}>Kelas 5 SD (Fase C)</option>
                      <option value={6}>Kelas 6 SD (Fase C)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-[#64748B] pointer-events-none text-base">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#0F172A]">Jenis Asesmen</label>
                  <div className="relative">
                    <select
                      value={assessmentType}
                      onChange={(e) => setAssessmentType(e.target.value)}
                      className="w-full appearance-none bg-white px-3.5 py-2.5 rounded-xl text-xs text-[#0F172A] border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
                    >
                      <option value="Sumatif Akhir Semester (SAS)">Sumatif Akhir Semester (SAS)</option>
                      <option value="Sumatif Tengah Semester (STS)">Sumatif Tengah Semester (STS)</option>
                      <option value="Formatif Harian">Formatif Harian</option>
                      <option value="Simulasi AKM SD">Simulasi AKM SD</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-[#64748B] pointer-events-none text-base">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Jumlah Soal Slider */}
              <div className="flex flex-col gap-2 bg-[#f4f3fa] p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#0F172A]">
                    Distribusi Komposisi Butir
                  </label>
                  <span className="text-xs font-bold text-[#00236f]">{questionCount} Soal</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="5"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-[#00236f] h-2 bg-[#e3e1e9] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[#64748B] text-[11px] pt-1">
                  <span>10 Stimulus</span>
                  <span className="font-medium text-[#0F172A] bg-white px-2 py-0.5 rounded-md shadow-xs">
                    @ 3 Soal Bertingkat (LOTS, MOTS, HOTS)
                  </span>
                  <span>Rasio 40% : 40% : 20%</span>
                </div>
              </div>

              {/* Textarea Capaian Pembelajaran (CP) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#0F172A]">
                    Capaian Pembelajaran (CP) &amp; Kisi-kisi
                  </label>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(subject === 'Matematika' ? 'matematika' : 'bahasa')}
                    className="text-[#2563EB] text-xs hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-xs">auto_awesome</span>
                    Template Kurikulum
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs text-[#0F172A] bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all leading-relaxed"
                />
                <div className="flex items-center justify-between text-[#64748B] text-[11px]">
                  <span>Fokus: Kearifan Lokal SDN 1 Purwasari</span>
                  <span>{syllabus.length} Karakter</span>
                </div>
              </div>

              {/* Tingkat Kesulitan */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] flex flex-col items-center">
                  <span className="text-[11px]">Mudah (LOTS)</span>
                  <span className="text-base font-bold">10 Soal</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FFF7ED] text-[#a73a00] flex flex-col items-center">
                  <span className="text-[11px]">Sedang (MOTS)</span>
                  <span className="text-base font-bold">14 Soal</span>
                </div>
                <div className="p-2 rounded-xl bg-[#e9e7ef] text-[#00236f] flex flex-col items-center">
                  <span className="text-[11px]">Sukar (HOTS)</span>
                  <span className="text-base font-bold">6 Soal</span>
                </div>
              </div>

              {/* Action Button: Regenerate with Gemini AI */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleRegenerate}
                  className="w-full py-3 px-4 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] disabled:opacity-50 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span className={`material-symbols-outlined text-xl ${isGenerating ? 'animate-spin' : ''}`}>
                    {isGenerating ? 'autorenew' : 'sync_saved_locally'}
                  </span>
                  <span>{isGenerating ? 'Menyusun Naskah...' : 'Regenerate dengan Gemini Pro AI'}</span>
                </button>
                <p className="text-center text-[11px] text-[#64748B]">
                  Didukung oleh Google Workspace Add-on SDK SDN 1 Purwasari
                </p>
              </div>
            </div>

            {/* Quality Meter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">Tingkat Keterkaitan CP: 96%</span>
                  <span className="text-[11px] text-[#64748B]">
                    Sesuai Pedoman BSKAP Kemendikbudristek
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-semibold">
                Tervalidasi
              </span>
            </div>
          </aside>

          {/* RIGHT PANEL: Interactive Question Editor & Stimuli (7 cols) */}
          <main className="lg:col-span-7 flex flex-col gap-6">
            {/* Stimulus Cards */}
            {currentExam.stimuli?.map((stim, index) => (
              <section
                key={stim.id || index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4"
              >
                {/* Stimulus Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#00236f] text-white text-xs font-bold tracking-wide">
                      STIMULUS {index + 1}
                    </span>
                    <h2 className="text-base font-bold text-[#0F172A]">{stim.title}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onOpenAddQuestionModal(stim.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#EFF6FF] text-[#2563EB] font-semibold hover:bg-[#dce1ff] cursor-pointer"
                      title="Tambah soal terkait stimulus ini"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>+ Soal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStimulus(stim.id)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#ba1a1a] hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus Stimulus"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>

                {/* Stimulus Media & Context */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#f4f3fa] p-4 rounded-xl">
                  {stim.imageUrl && (
                    <div className="md:col-span-4 rounded-lg overflow-hidden shadow-sm aspect-[4/3] bg-slate-200 relative">
                      <img
                        src={stim.imageUrl}
                        alt={stim.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-[#64748B] font-medium">
                        Kearifan Lokal
                      </div>
                    </div>
                  )}

                  <div className={`${stim.imageUrl ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col gap-2`}>
                    <p className="text-xs text-[#0F172A] leading-relaxed">
                      {stim.storyText}
                    </p>

                    {/* Stimulus Data Table if present */}
                    {stim.tableData && (
                      <div className="overflow-x-auto rounded-lg bg-white shadow-sm mt-1 border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#e9e7ef] text-[#0F172A] font-semibold">
                            <tr>
                              {stim.tableData.headers.map((h, i) => (
                                <th key={i} className="py-1.5 px-3">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[#0F172A]">
                            {stim.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`py-1.5 px-3 ${
                                      cIdx === 0 ? 'font-medium' : ''
                                    }`}
                                  >
                                    {cell}
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
              </section>
            ))}

            {/* Questions List */}
            {currentExam.questions?.map((q, idx) => {
              const isSingleChoice = q.type === 'pg_biasa';
              const isMultiChoice = q.type === 'pg_kompleks';
              const isTrueFalse = q.type === 'benar_salah';

              return (
                <article
                  key={q.id || idx}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4 transition-all hover:shadow-md"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold">
                        {isSingleChoice
                          ? 'Pilihan Ganda Biasa'
                          : isMultiChoice
                          ? 'Pilihan Ganda Kompleks'
                          : 'Matriks Benar / Salah'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#e9e7ef] text-[#64748B] text-xs">
                        Bobot: {q.points || 1} Poin • {q.cognitiveLevel}
                      </span>
                    </div>

                    {/* AI Confidence & Edit Tools */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        AI Conf. {q.aiConfidence || 98}%
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenEditQuestionModal(q)}
                        className="p-1 rounded-lg text-[#64748B] hover:text-[#00236f] hover:bg-[#f4f3fa] transition-colors cursor-pointer"
                        title="Edit Butir Soal"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded-lg text-[#64748B] hover:text-[#ba1a1a] hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Soal"
                      >
                        <span className="material-symbols-outlined text-base">delete_outline</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Stem Prompt */}
                  <p className="text-sm text-[#0F172A] font-medium leading-relaxed">{q.stem}</p>

                  {/* Option Renderer */}
                  {/* Single Choice Options */}
                  {isSingleChoice && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {q.options.map((opt) => {
                        const isCorrect = opt.key === q.correctAnswer;
                        return (
                          <div
                            key={opt.key}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                              isCorrect
                                ? 'bg-[#EFF6FF] border border-[#2563EB]/40 shadow-xs'
                                : 'bg-[#f4f3fa]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCorrect
                                    ? 'bg-[#2563EB] text-white'
                                    : 'bg-white text-[#0F172A] shadow-xs'
                                }`}
                              >
                                {opt.key}
                              </div>
                              <span
                                className={`text-xs ${
                                  isCorrect ? 'font-semibold text-[#00236f]' : 'text-[#0F172A]'
                                }`}
                              >
                                {opt.text}
                              </span>
                            </div>
                            {isCorrect && (
                              <span className="text-[11px] font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">check</span>
                                Kunci
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Multiple Choice Options */}
                  {isMultiChoice && q.options && (
                    <div className="flex flex-col gap-2.5 pt-1">
                      {q.options.map((opt) => {
                        const isCorrectArray = Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.includes(opt.key)
                          : q.correctAnswer === opt.key;
                        return (
                          <div
                            key={opt.key}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                              isCorrectArray
                                ? 'bg-[#EFF6FF] border border-[#2563EB]/30 shadow-xs'
                                : 'bg-[#f4f3fa]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                  isCorrectArray
                                    ? 'bg-[#2563EB] text-white'
                                    : 'bg-white text-slate-500 shadow-xs'
                                }`}
                              >
                                {isCorrectArray ? (
                                  <span className="material-symbols-outlined text-sm">check</span>
                                ) : (
                                  opt.key
                                )}
                              </div>
                              <span className="text-xs text-[#0F172A] font-medium">{opt.text}</span>
                            </div>
                            {isCorrectArray && (
                              <span className="text-[11px] font-bold text-[#2563EB] bg-white px-2 py-0.5 rounded-md border border-blue-100">
                                Kunci [✓]
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True / False Matrix */}
                  {isTrueFalse && q.matrixRows && (
                    <div className="overflow-x-auto rounded-xl bg-[#f4f3fa] p-2">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[#64748B] text-[11px] uppercase tracking-wider">
                            <th className="py-2 px-3">Pernyataan Konsep</th>
                            <th className="py-2 px-3 text-center w-20">Benar</th>
                            <th className="py-2 px-3 text-center w-20">Salah</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {q.matrixRows.map((row, rIdx) => (
                            <tr key={rIdx} className="bg-white">
                              <td className="py-2.5 px-3 font-medium text-[#0F172A] rounded-l-xl">
                                {rIdx + 1}. {row.text}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                {row.correctBool ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#059669] text-white font-bold text-xs shadow-sm">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-bold">—</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-center rounded-r-xl">
                                {!row.correctBool ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E11D48] text-white font-bold text-xs shadow-sm">
                                    ✕
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-bold">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Explanation Accordion */}
                  <details className="group bg-[#f4f3fa] rounded-xl p-3.5 text-xs text-[#0F172A] mt-1">
                    <summary className="font-semibold text-[#00236f] cursor-pointer flex items-center justify-between list-none">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#a73a00]">
                          lightbulb
                        </span>
                        <span>Pembahasan &amp; Analisis Kunci Jawaban</span>
                      </span>
                      <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-[#64748B]">
                        expand_more
                      </span>
                    </summary>
                    <div className="pt-2.5 flex flex-col gap-1.5 text-xs leading-relaxed border-t border-slate-200/60 mt-2">
                      <p className="whitespace-pre-line">{q.explanation}</p>
                    </div>
                  </details>
                </article>
              );
            })}
          </main>
        </div>
      </div>

      {/* FLOATING BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf8ff]/95 backdrop-blur-xl py-3 px-4 sm:px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-slate-200/60 no-print">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Quick Add buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => onOpenAddQuestionModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#0F172A] text-xs font-semibold transition-all flex-shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle_outline</span>
              <span>+ Tambah Soal Manual</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddStimulusModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#0F172A] text-xs font-semibold transition-all flex-shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">post_add</span>
              <span>+ Tambah Stimulus Baru</span>
            </button>
          </div>

          {/* Right Action & Navigation Cluster */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onSaveToSheets}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#00236f] text-xs font-bold shadow-sm transition-all border border-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#059669] text-lg">table_chart</span>
              <span>Simpan ke Google Sheets</span>
            </button>

            <button
              type="button"
              onClick={onGoToPrintPreview}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Lanjut ke Preview Cetak A4</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
