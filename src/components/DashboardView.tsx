import React, { useState } from 'react';
import { ExamPackage, UserProfile } from '../types';

interface DashboardViewProps {
  exams: ExamPackage[];
  activeUser: UserProfile;
  onOpenCreateNew: () => void;
  onSelectExamForEdit: (pkg: ExamPackage) => void;
  onSelectExamForPrint: (pkg: ExamPackage) => void;
  onSelectExamForExamMode: (pkg: ExamPackage) => void;
  onDeleteExam: (id: string) => void;
  onOpenGuideModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exams,
  activeUser,
  onOpenCreateNew,
  onSelectExamForEdit,
  onSelectExamForPrint,
  onSelectExamForExamMode,
  onDeleteExam,
  onOpenGuideModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'final' | 'draft' | 'active'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Filtered exams
  const filteredExams = exams.filter((pkg) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = pkg.title.toLowerCase().includes(q);
      const matchSummary = pkg.summary.toLowerCase().includes(q);
      const matchSubject = pkg.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchSubject) return false;
    }
    if (statusFilter !== 'all' && pkg.status !== statusFilter) {
      return false;
    }
    if (classFilter !== 'all' && pkg.grade.toString() !== classFilter) {
      return false;
    }
    if (subjectFilter !== 'all' && pkg.subject !== subjectFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#00236f] via-[#1e3a8a] to-[#4059aa] p-6 sm:p-10 text-white shadow-md">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#fd651e]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-16 w-80 h-80 rounded-full bg-[#b6c4ff]/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md w-fit">
              <span className="material-symbols-outlined text-sm text-[#ffdbce]">auto_awesome</span>
              <span className="text-xs font-bold tracking-wider text-[#ffdbce] uppercase">
                Kurikulum Merdeka 2024/2025
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Selamat Datang, {activeUser.name}
            </h1>
            <p className="text-sm sm:text-base text-[#b6c4ff] leading-relaxed">
              Platform Otomasi Asesmen TKA SDN 1 Purwasari berbasis Google Workspace &amp; Gemini AI.
              Siapkan asesmen bermakna dan terstandarisasi dalam hitungan detik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateNew}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white shadow-md transition-all active:scale-[0.98] font-bold text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>+ Buat Naskah Baru</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-wider">
                Gemini AI
              </span>
            </button>
            <button
              type="button"
              onClick={onOpenGuideModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors text-sm font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">menu_book</span>
              <span>Panduan Kisi-kisi</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metric KPI Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Total Naskah Dibuat</span>
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#00236f] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-[#0F172A]">{exams.length}</span>
              <span className="text-sm text-[#64748B]">Paket</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[#059669] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+4 bulan ini</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Butir Soal Terverifikasi</span>
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-[#0F172A]">
                {exams.reduce((acc, curr) => acc + (curr.questions?.length || 25), 0)}
              </span>
              <span className="text-sm text-[#64748B]">Butir Soal</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[#64748B] text-xs">
              <span className="material-symbols-outlined text-sm text-[#00236f]">fact_check</span>
              <span>100% Selaras Kisi-kisi BSKAP</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Siswa Telah Mengikuti</span>
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#a73a00] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-[#0F172A]">142</span>
              <span className="text-sm text-[#64748B]">Siswa</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[#64748B] text-xs">
              <span className="material-symbols-outlined text-sm text-[#a73a00]">school</span>
              <span>Rombel Kelas 4, 5 &amp; 6</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Rata-rata Nilai TKA</span>
            <div className="w-10 h-10 rounded-xl bg-[#dce1ff] text-[#00236f] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-[#0F172A]">84.5</span>
              <span className="text-sm text-[#64748B]">/ 100</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[#059669] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">military_tech</span>
              <span>Predikat Sangat Baik</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Area (8 Cols Left, 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Search, Filter Tabs & Question Sets Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Search and Filters */}
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari naskah atau materi..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f3fa] text-[#1a1b21] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-[#64748B]"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#f4f3fa] rounded-xl">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white text-[#00236f] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1a1b21]'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('final')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'final'
                      ? 'bg-white text-[#00236f] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1a1b21]'
                  }`}
                >
                  Siap Cetak
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('draft')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'draft'
                      ? 'bg-white text-[#00236f] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1a1b21]'
                  }`}
                >
                  Draft AI
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'active'
                      ? 'bg-white text-[#00236f] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1a1b21]'
                  }`}
                >
                  Sedang Diuji
                </button>
              </div>
            </div>

            {/* Granular Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[#64748B] text-xs">
                <span className="material-symbols-outlined text-sm">tune</span>
                <span>Filter:</span>
              </div>

              {/* Class Filter */}
              <div className="relative">
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-[#f4f3fa] text-[#1a1b21] text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Kelas</option>
                  <option value="1">Kelas 1 SD</option>
                  <option value="2">Kelas 2 SD</option>
                  <option value="3">Kelas 3 SD</option>
                  <option value="4">Kelas 4 SD</option>
                  <option value="5">Kelas 5 SD</option>
                  <option value="6">Kelas 6 SD</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] text-sm">
                  expand_more
                </span>
              </div>

              {/* Subject Filter */}
              <div className="relative">
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-[#f4f3fa] text-[#1a1b21] text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Mata Pelajaran</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] text-sm">
                  expand_more
                </span>
              </div>

              <div className="ml-auto text-[#64748B] text-xs">
                Menampilkan <strong className="text-[#0F172A]">{filteredExams.length}</strong> dari{' '}
                {exams.length} Naskah
              </div>
            </div>
          </div>

          {/* Cards Feed */}
          <div className="flex flex-col gap-4">
            {filteredExams.map((pkg) => {
              const isMath = pkg.subject === 'Matematika';
              const isFinal = pkg.status === 'final';
              const isDraft = pkg.status === 'draft';
              const isActive = pkg.status === 'active';

              return (
                <article
                  key={pkg.id}
                  className={`p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col gap-4 border border-slate-100 relative overflow-hidden ${
                    isDraft ? 'border-l-4 border-l-[#D97706]' : ''
                  } ${isActive ? 'border-l-4 border-l-[#2563EB]' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                            isMath
                              ? 'bg-[#EFF6FF] text-[#2563EB]'
                              : 'bg-[#FFF7ED] text-[#a73a00]'
                          }`}
                        >
                          {pkg.subject}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#e9e7ef] text-[#444651] text-xs font-medium">
                          Kelas {pkg.grade} SD
                        </span>
                        {isFinal && (
                          <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] text-xs font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Final / Siap Cetak
                          </span>
                        )}
                        {isDraft && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FFF7ED] text-[#D97706] text-xs font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">pending</span>
                            Draft AI (Perlu Validasi)
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                            Aktif Ujian ({pkg.stats?.studentAttempts || 32} Siswa)
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#0F172A] mt-1">
                        {pkg.title}
                      </h3>

                      <div className="flex items-center gap-4 text-[#64748B] text-xs flex-wrap mt-0.5">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">quiz</span>
                          {pkg.questions?.length || 30} Soal ({pkg.stimuli?.length || 2} Stimulus)
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {pkg.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">person</span>
                          {pkg.authorName}
                        </span>
                      </div>
                    </div>

                    {/* Target Ketuntasan / Student Progress Spark */}
                    <div className="hidden xl:flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs text-[#64748B]">Target Ketuntasan</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#e9e7ef] rounded-full h-2">
                          <div
                            className="bg-[#059669] h-2 rounded-full"
                            style={{ width: `${pkg.targetPassRate || 85}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-[#1a1b21]">
                          {pkg.targetPassRate || 85}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#64748B]">Format:</span>
                      <span className="px-2 py-0.5 rounded bg-[#f4f3fa] text-xs text-[#444651] font-medium">
                        {pkg.formatDescription || 'Pilihan Ganda & Kompleks'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => onSelectExamForPrint(pkg)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#1a1b21] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">print</span>
                        <span>Preview &amp; Cetak</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectExamForExamMode(pkg)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#dce1ff] text-[#00236f] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">play_arrow</span>
                        <span>Buka Ujian</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectExamForEdit(pkg)}
                        className="p-1.5 rounded-xl text-[#64748B] hover:bg-[#f4f3fa] hover:text-[#1a1b21] transition-colors cursor-pointer"
                        title="Edit Soal & Kisi-kisi"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>

                      {/* Admin or Author can delete */}
                      {(activeUser.role === 'Admin' || activeUser.name === pkg.authorName) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus naskah "${pkg.title}"?`)) {
                              onDeleteExam(pkg.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-[#64748B] hover:bg-red-50 hover:text-[#ba1a1a] transition-colors cursor-pointer"
                          title="Hapus Naskah"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredExams.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  search_off
                </span>
                <p className="text-sm text-slate-600">Tidak ada naskah yang sesuai filter pencarian.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setClassFilter('all');
                    setSubjectFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EFF6FF] text-[#00236f] text-xs font-semibold hover:bg-[#dce1ff]"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Connection status, teacher activities, and assessment calendar */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Live System Connection */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#0F172A]">Koneksi Sistem SDN 1</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                Aktif &amp; Terhubung
              </span>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f4f3fa]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#00236f] shadow-xs">
                    <span className="material-symbols-outlined text-lg">table_chart</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#1a1b21]">Google Spreadsheet</span>
                    <span className="text-[11px] text-[#64748B]">Master Bank Soal SDN 1</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#059669] text-base">check</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f4f3fa]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#a73a00] shadow-xs">
                    <span className="material-symbols-outlined text-lg">neurology</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#1a1b21]">Gemini AI Engine</span>
                    <span className="text-[11px] text-[#64748B]">Kurikulum Merdeka Ready</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#059669] text-base">check</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF7ED] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#a73a00] text-lg mt-0.5">info</span>
              <p className="text-xs text-[#a73a00] leading-snug">
                Semua naskah otomatis tersinkronisasi ke Google Drive SDN 1 Purwasari dalam format Dokumen
                dan Formulir Ujian.
              </p>
            </div>
          </div>

          {/* Teachers Recent Activity */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#0F172A]">Aktivitas Guru Terkini</h3>
                <span className="text-xs text-[#64748B]">SDN 1 Purwasari Hari Ini</span>
              </div>
              <button
                type="button"
                className="p-1 text-[#00236f] hover:bg-[#f4f3fa] rounded-lg transition-colors cursor-pointer"
                title="Perbarui"
              >
                <span className="material-symbols-outlined text-lg">sync</span>
              </button>
            </div>

            <div className="relative flex flex-col gap-4 pl-2 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#e9e7ef]">
              {/* Activity 1 */}
              <div className="relative flex items-start gap-3">
                <div className="relative z-10 w-7 h-7 rounded-full bg-[#dce1ff] text-[#00236f] flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-white">
                  PA
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs text-[#1a1b21]">
                    <strong className="font-semibold">Pak Ahmad Fauzi, S.Pd.</strong> membuat paket naskah{' '}
                    <span className="text-[#00236f] font-medium">B. Indonesia Kelas 3</span>
                  </p>
                  <span className="text-[11px] text-[#64748B] mt-0.5">25 menit yang lalu</span>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="relative flex items-start gap-3">
                <div className="relative z-10 w-7 h-7 rounded-full bg-[#ffdbce] text-[#a73a00] flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-white">
                  BS
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs text-[#1a1b21]">
                    <strong className="font-semibold">Bu Siti Aminah</strong> mengunduh kunci jawaban &amp;
                    rubrik <span className="text-[#a73a00] font-medium">TKA Matematika Kelas 5</span>
                  </p>
                  <span className="text-[11px] text-[#64748B] mt-0.5">1 jam yang lalu</span>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="relative flex items-start gap-3">
                <div className="relative z-10 w-7 h-7 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-white">
                  <span className="material-symbols-outlined text-xs">print</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs text-[#1a1b21]">
                    <strong className="font-semibold">Staf Tata Usaha</strong> mencetak 35 lembar soal A4
                    untuk asesmen ruang Kelas 4B
                  </p>
                  <span className="text-[11px] text-[#64748B] mt-0.5">3 jam yang lalu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Calendar Card */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A]">Kalender Asesmen TKA</h3>
              <span className="material-symbols-outlined text-[#64748B]">calendar_month</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-[#f4f3fa] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1b21]">Simulasi TKA Semester 1</span>
                  <span className="text-[11px] text-[#64748B]">Kelas 4 &amp; 5 • 28 - 30 Okt 2024</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ffdbce] text-[#370e00] text-xs font-bold">
                  H-4
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f3fa] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1b21]">Try Out Akbar Kabupaten</span>
                  <span className="text-[11px] text-[#64748B]">Kelas 6 • 11 Nov 2024</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#e3e1e9] text-[#444651] text-xs font-medium">
                  H-18
                </span>
              </div>
            </div>

            <div className="relative w-full h-32 rounded-xl overflow-hidden mt-1 shadow-inner bg-slate-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBJCrAVPjfUbJBMx49op_ncySgikgLekGNChZllP5Wj5iKGHt1YILCQMrpbWCPow-AQHtFMKEfId8wr8IAKmeggD-GjmhaZhB4z1_5zmTKfyQD3u6P-T9p5wgwKqRsXxhfQKr7tPH3g-K8NDXWCzg0c4wv7jPg5_aQNot1X21_JKgp6NtIkbqYUSufEWb8kIrgWHGhzAhM4F-0M3OV3-ufAR2fRESWBVZpuu0-YmM"
                alt="Suasana Simulasi CBT Ruang Kelas 4A"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-white text-xs font-semibold">
                  Suasana Simulasi CBT Ruang Kelas 4A
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
