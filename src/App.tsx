import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import {
  ExamPackage,
  UserProfile,
  Teacher,
  Student,
  ExamResult,
  AppSettings,
  Question,
  Stimulus,
} from './types';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GeneratorEditorView } from './components/GeneratorEditorView';
import { PrintPreviewView } from './components/PrintPreviewView';
import { ExamRuntimeView } from './components/ExamRuntimeView';
import { ExamResultView } from './components/ExamResultView';
import { ManageStudentsModal } from './components/ManageStudentsModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { QuestionModal } from './components/QuestionModal';
import { StimulusModal } from './components/StimulusModal';
import { CertificateModal } from './components/CertificateModal';
import { SolutionsModal } from './components/SolutionsModal';
import { GuideModal } from './components/GuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard-naskah');
  const [activeUser, setActiveUser] = useState<UserProfile>(storage.getActiveUser());
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [teachers, setTeachers] = useState<Teacher[]>(storage.getTeachers());
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [exams, setExams] = useState<ExamPackage[]>(storage.getExams());
  const [results, setResults] = useState<ExamResult[]>(storage.getExamResults());

  // Currently focused exam package
  const [currentExam, setCurrentExam] = useState<ExamPackage>(() => {
    const list = storage.getExams();
    return list[0] || ({} as ExamPackage);
  });

  // Currently focused exam result
  const [currentResult, setCurrentResult] = useState<ExamResult>(() => {
    const list = storage.getExamResults();
    return list[0] || ({} as ExamResult);
  });

  // Modals state
  const [showManageStudents, setShowManageStudents] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showAddStimulusModal, setShowAddStimulusModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showSolutionsModal, setShowSolutionsModal] = useState(false);

  // Question Modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [targetStimulusId, setTargetStimulusId] = useState<string | undefined>(undefined);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3200);
  };

  // Sync active user change
  const handleChangeUser = (newUser: UserProfile) => {
    setActiveUser(newUser);
    storage.setActiveUser(newUser);
    showToast(`Beralih peran ke: ${newUser.name} (${newUser.role})`);
  };

  // Exam selection handlers
  const handleSelectExamForEdit = (pkg: ExamPackage) => {
    setCurrentExam(pkg);
    setActiveTab('generator-ai-&-editor');
  };

  const handleSelectExamForPrint = (pkg: ExamPackage) => {
    setCurrentExam(pkg);
    setActiveTab('preview-cetak-a4');
  };

  const handleSelectExamForExamMode = (pkg: ExamPackage) => {
    setCurrentExam(pkg);
    setActiveTab('mode-ujian-siswa');
  };

  const handleOpenCreateNew = () => {
    const newPkg: ExamPackage = {
      id: `pkg-${Date.now()}`,
      title: 'Latihan TKA Baru: Bab Pilihan Terpadu',
      subject: 'Matematika',
      grade: 4,
      assessmentType: 'Sumatif Akhir Semester (SAS)',
      status: 'draft',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      authorName: activeUser.name,
      authorNip: activeUser.nip || '19850417 201101 2 009',
      authorRole: activeUser.title || activeUser.role,
      durationMinutes: 90,
      targetPassRate: 85,
      curriculum: 'Kurikulum Merdeka 2024/2025',
      summary:
        'Peserta didik dapat menyelesaikan masalah berkaitan dengan operasi perkalian dan pembagian bilangan cacah sampai 100 di lingkungan pasar lokal SDN 1 Purwasari.',
      stimuli: [
        {
          id: `stim-${Date.now()}`,
          title: 'Pasar Rakyat Purwasari: Menghitung Belanja Hasil Bumi',
          context: 'Kegiatan ekonomi kontekstual pedagang sayur dan buah lokal',
          storyText:
            'Di Pasar Rakyat Purwasari, para petani membawa aneka sayuran segar hasil kebun desa. Farhan mengamati daftar harga wortel, kubis, dan cabai yang dijual dalam paket timbangan per kilogram.',
          tableData: {
            headers: ['Komoditas', 'Harga per Kg', 'Diskon Grosir'],
            rows: [
              ['Wortel Manis', 'Rp 12.000', 'Beli ≥ 3 kg potongan Rp 1.000/kg'],
              ['Kubis Organik', 'Rp 8.000', 'Tidak ada diskon'],
              ['Tomat Merah', 'Rp 14.000', 'Beli 2 kg Rp 25.000'],
            ],
          },
        },
      ],
      questions: [
        {
          id: `q-${Date.now()}-1`,
          number: 1,
          type: 'pg_biasa',
          stem: 'Berapakah biaya yang harus dibayar jika Farhan membeli 4 kg Wortel Manis setelah dipotong diskon belanja?',
          cognitiveLevel: 'LOTS',
          points: 1,
          aiConfidence: 99,
          options: [
            { key: 'A', text: 'Rp 48.000' },
            { key: 'B', text: 'Rp 44.000' },
            { key: 'C', text: 'Rp 42.000' },
            { key: 'D', text: 'Rp 40.000' },
          ],
          correctAnswer: 'B',
          explanation:
            'Harga normal = 4 × Rp 12.000 = Rp 48.000. Diskon = 4 × Rp 1.000 = Rp 4.000. Total bayar = Rp 48.000 - Rp 4.000 = Rp 44.000.',
          source: 'manual',
        },
      ],
    };

    const updated = [newPkg, ...exams];
    setExams(updated);
    storage.saveExam(newPkg);
    setCurrentExam(newPkg);
    setActiveTab('generator-ai-&-editor');
    showToast('Paket naskah baru dibuat! Siap dirancang bersama AI.');
  };

  const handleUpdateCurrentExam = (updated: ExamPackage) => {
    setCurrentExam(updated);
    storage.saveExam(updated);
    setExams(storage.getExams());
  };

  const handleDeleteExam = (id: string) => {
    storage.deleteExam(id);
    const updated = storage.getExams();
    setExams(updated);
    if (currentExam.id === id) {
      setCurrentExam(updated[0] || ({} as ExamPackage));
    }
    showToast('Naskah berhasil dihapus dari bank soal.');
  };

  const handleSaveToSheets = () => {
    storage.saveExam(currentExam);
    setExams(storage.getExams());
    showToast('Semua butir soal & stimulus berhasil disimpan ke Google Sheets SDN 1!');
  };

  // Submit Exam
  const handleSubmitExamResult = (result: ExamResult) => {
    storage.saveExamResult(result);
    setResults(storage.getExamResults());
    setCurrentResult(result);
    setActiveTab('analisis-hasil');
    showToast('Jawaban berhasil dikirim! Menampilkan analisis nilai...');
  };

  // Question Modal Helpers
  const handleOpenAddQuestion = (stimId?: string) => {
    setEditingQuestion(null);
    setTargetStimulusId(stimId);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (q: Question) => {
    const list = [...(currentExam.questions || [])];
    const index = list.findIndex((item) => item.id === q.id);
    if (index >= 0) {
      list[index] = q;
    } else {
      list.push(q);
    }
    const updated = { ...currentExam, questions: list };
    handleUpdateCurrentExam(updated);
    showToast('Butir soal berhasil disimpan!');
  };

  const handleSaveStimulus = (stim: Stimulus) => {
    const list = [...(currentExam.stimuli || []), stim];
    const updated = { ...currentExam, stimuli: list };
    handleUpdateCurrentExam(updated);
    showToast('Stimulus baru berhasil ditambahkan!');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#1a1b21] flex flex-col font-sans selection:bg-[#dce1ff] selection:text-[#00164e]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeUser={activeUser}
        onChangeUser={handleChangeUser}
        onOpenCreateNew={handleOpenCreateNew}
        onOpenAdminSettings={() => setShowAdminSettings(true)}
        onOpenManageStudents={() => setShowManageStudents(true)}
      />

      {/* Main Content Area (pt-28 accounts for the fixed 2-row header) */}
      <main className="w-full pt-28 flex-1">
        {activeTab === 'dashboard-naskah' && (
          <DashboardView
            exams={exams}
            activeUser={activeUser}
            onOpenCreateNew={handleOpenCreateNew}
            onSelectExamForEdit={handleSelectExamForEdit}
            onSelectExamForPrint={handleSelectExamForPrint}
            onSelectExamForExamMode={handleSelectExamForExamMode}
            onDeleteExam={handleDeleteExam}
            onOpenGuideModal={() => setShowGuideModal(true)}
          />
        )}

        {activeTab === 'generator-ai-&-editor' && (
          <GeneratorEditorView
            currentExam={currentExam}
            onUpdateExam={handleUpdateCurrentExam}
            onSaveToSheets={handleSaveToSheets}
            onGoToPrintPreview={() => setActiveTab('preview-cetak-a4')}
            onOpenAddQuestionModal={handleOpenAddQuestion}
            onOpenEditQuestionModal={handleOpenEditQuestion}
            onOpenAddStimulusModal={() => setShowAddStimulusModal(true)}
          />
        )}

        {activeTab === 'preview-cetak-a4' && (
          <PrintPreviewView
            currentExam={currentExam}
            settings={settings}
            onGoBackToEditor={() => setActiveTab('generator-ai-&-editor')}
          />
        )}

        {activeTab === 'mode-ujian-siswa' && (
          <ExamRuntimeView
            currentExam={currentExam}
            activeUser={activeUser}
            onSubmitExam={handleSubmitExamResult}
            onGoToResultsView={() => setActiveTab('analisis-hasil')}
          />
        )}

        {activeTab === 'analisis-hasil' && (
          <ExamResultView
            result={currentResult}
            exam={currentExam}
            onGoBackToExam={() => setActiveTab('mode-ujian-siswa')}
            onGoToDashboard={() => setActiveTab('dashboard-naskah')}
            onOpenCertificateModal={() => setShowCertificateModal(true)}
            onOpenSolutionsModal={() => setShowSolutionsModal(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      {isQuestionModalOpen && (
        <QuestionModal
          initialQuestion={editingQuestion}
          stimuli={currentExam.stimuli || []}
          defaultStimulusId={targetStimulusId}
          totalQuestionsSoFar={currentExam.questions?.length || 0}
          onSave={handleSaveQuestion}
          onClose={() => setIsQuestionModalOpen(false)}
        />
      )}

      {showAddStimulusModal && (
        <StimulusModal
          onSave={handleSaveStimulus}
          onClose={() => setShowAddStimulusModal(false)}
        />
      )}

      {showManageStudents && (
        <ManageStudentsModal
          students={students}
          onSaveStudent={(st) => {
            storage.saveStudent(st);
            setStudents(storage.getStudents());
            showToast(`Siswa ${st.name} berhasil disimpan!`);
          }}
          onDeleteStudent={(id) => {
            storage.deleteStudent(id);
            setStudents(storage.getStudents());
            showToast('Siswa berhasil dihapus.');
          }}
          onClose={() => setShowManageStudents(false)}
        />
      )}

      {showAdminSettings && (
        <AdminSettingsModal
          settings={settings}
          teachers={teachers}
          exams={exams}
          students={students}
          results={results}
          onSaveSettings={(s) => {
            storage.saveSettings(s);
            setSettings(s);
            showToast('Identitas sekolah & tema berhasil diperbarui!');
          }}
          onSaveTeacher={(t) => {
            storage.saveTeacher(t);
            setTeachers(storage.getTeachers());
            showToast(`Akun guru ${t.name} berhasil disimpan!`);
          }}
          onDeleteTeacher={(id) => {
            storage.deleteTeacher(id);
            setTeachers(storage.getTeachers());
            showToast('Akun guru dihapus.');
          }}
          onClose={() => setShowAdminSettings(false)}
        />
      )}

      {showCertificateModal && (
        <CertificateModal
          result={currentResult}
          settings={settings}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {showSolutionsModal && (
        <SolutionsModal
          exam={currentExam}
          result={currentResult}
          onClose={() => setShowSolutionsModal(false)}
        />
      )}

      {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} />}

      {/* Global Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5 no-print">
          <span className="material-symbols-outlined text-[#059669] text-xl">check_circle</span>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Standard School Footer */}
      <footer className="w-full bg-[#f4f3fa] py-8 border-t border-slate-200/60 no-print mt-auto">
        <div className="w-full px-4 sm:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[#64748B] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#00236f]">TKA GURU • SDN 1 Purwasari</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Sistem Bank Soal &amp; Asesmen Standar Sekolah Dasar</span>
          </div>
          <div className="text-center md:text-right">
            © 2024–2025 SDN 1 Purwasari. Terintegrasi Kurikulum Merdeka.
          </div>
        </div>
      </footer>
    </div>
  );
}
