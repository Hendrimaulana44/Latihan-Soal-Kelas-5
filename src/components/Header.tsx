import React, { useState } from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeUser: UserProfile;
  onChangeUser: (user: UserProfile) => void;
  onOpenCreateNew: () => void;
  onOpenAdminSettings: () => void;
  onOpenManageStudents: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeUser,
  onChangeUser,
  onOpenCreateNew,
  onOpenAdminSettings,
  onOpenManageStudents,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  const [showNotifPopup, setShowNotifPopup] = useState(false);

  const sampleUsers: UserProfile[] = [
    {
      id: 'guru-1',
      name: 'Ibu Ratna Dewi, S.Pd.',
      role: 'Admin',
      email: 'ratnadewi@purwasari.sch.id',
      nip: '19850417 201101 2 009',
      grade: 4,
      title: 'Guru Kelas 4 & Admin',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDzyVQJeO6ZkBBzV2ML-muatiR5uR0oov686uXgv6DKPFwCfC-vUr5Xxt_UD484szRrr7a4tXSAsqEqbM8O4OCHzR99jucAgYdYvth_uT0ssdQuZ07R2vA39MqQDIp33fx110cUbxr2BHjbubx-BD-sKAUTWJVwHsffMtJxDq8YYEK5yZrhCUJK6_0hxgMA2f3MGu20l4A30vFS0v5IWBSs9bJsQ7LvvgucFUcLN4c',
    },
    {
      id: 'guru-2',
      name: 'Pak Ahmad Fauzi, S.Pd.',
      role: 'Guru',
      email: 'ahmadfauzi@purwasari.sch.id',
      nip: '19870921 201402 1 003',
      grade: 3,
      title: 'Guru Kelas 3',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'siswa-1',
      name: 'Muhammad Farhan',
      role: 'Siswa',
      nisn: '0129845721',
      grade: 4,
      classGroup: 'Kelas 4A',
      title: 'Siswa Kelas 4A (NISN: 0129845721)',
      avatar:
        'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] no-print">
      <div className="h-28 w-full flex flex-col justify-between">
        {/* Top Bar Row (h-16) */}
        <div className="h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo & School identity */}
          <div
            className="flex items-center gap-3 min-w-0 cursor-pointer"
            onClick={() => setActiveTab('dashboard-naskah')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#00236f] flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">auto_stories</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#00236f] tracking-tight truncate">
                  TKA GURU
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ffdbce] text-[#370e00] font-bold">
                  SD
                </span>
                {activeUser.role === 'Admin' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#dce1ff] text-[#00164e] font-semibold hidden sm:inline">
                    ADMIN
                  </span>
                )}
              </div>
              <span className="text-xs text-[#64748B] truncate">
                SDN 1 Purwasari • TA 2024/2025
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Create Exam Button */}
            {activeUser.role !== 'Siswa' && (
              <button
                type="button"
                onClick={onOpenCreateNew}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white shadow-sm transition-all duration-150 active:scale-95 font-semibold text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span className="hidden sm:inline">Buat Naskah Baru</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifikasi"
                onClick={() => setShowNotifPopup(!showNotifPopup)}
                className="p-2 rounded-xl text-[#444651] hover:bg-[#e9e7ef] hover:text-[#1a1b21] transition-colors relative cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#a73a00]"></span>
                )}
              </button>

              {showNotifPopup && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-[#0F172A]">Notifikasi Sistem</span>
                    <button
                      onClick={() => setNotificationCount(0)}
                      className="text-xs text-[#2563EB] hover:underline"
                    >
                      Tandai dibaca
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5 pt-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#1E3A8A]">
                      <div className="font-semibold">Sinkronisasi Gemini Pro Siap</div>
                      <div className="text-slate-600 mt-0.5">
                        Template kisi-kisi Kurikulum Merdeka Fase B SDN 1 telah diperbarui.
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFF7ED] text-[#a73a00]">
                      <div className="font-semibold">32 Siswa Selesai Ujian</div>
                      <div className="text-slate-600 mt-0.5">
                        Rekap hasil simulasi TKA Matematika Kelas 4 siap diunduh.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1.5 py-1 pr-2 rounded-xl hover:bg-[#eeedf4] transition-colors cursor-pointer"
              >
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs text-[#1a1b21] font-semibold truncate max-w-[150px]">
                    {activeUser.name}
                  </span>
                  <span className="text-[11px] text-[#64748B] truncate max-w-[150px]">
                    {activeUser.title || activeUser.role}
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-sm">
                  expand_more
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="p-2.5 pb-2 border-b border-slate-100">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      Ganti Akun Pengguna (RBAC)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Pilih peran untuk menguji hak akses sistem:
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 py-1">
                    {sampleUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          onChangeUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                          activeUser.id === u.id
                            ? 'bg-[#EFF6FF] text-[#00236f] font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs truncate">{u.name}</span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {u.title || u.role}
                          </span>
                        </div>
                        {activeUser.id === u.id && (
                          <span className="material-symbols-outlined text-sm text-[#2563EB] ml-auto">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenManageStudents();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm text-slate-500">
                        groups
                      </span>
                      <span>Kelola Data Siswa & NISN</span>
                    </button>
                    {activeUser.role === 'Admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenAdminSettings();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm text-slate-500">
                          tune
                        </span>
                        <span>Pengaturan Admin & Profil Guru</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar Row (h-12) */}
        <div className="h-12 px-4 sm:px-8 flex items-center overflow-x-auto border-t border-slate-100/60">
          <nav className="flex items-center gap-1.5 py-1">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard-naskah')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'dashboard-naskah'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#444651] hover:text-[#1a1b21] hover:bg-[#e9e7ef]'
              }`}
            >
              Dashboard Naskah
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('generator-ai-&-editor')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'generator-ai-&-editor'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#444651] hover:text-[#1a1b21] hover:bg-[#e9e7ef]'
              }`}
            >
              Generator AI & Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview-cetak-a4')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'preview-cetak-a4'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#444651] hover:text-[#1a1b21] hover:bg-[#e9e7ef]'
              }`}
            >
              Preview Cetak A4
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mode-ujian-siswa')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'mode-ujian-siswa'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#444651] hover:text-[#1a1b21] hover:bg-[#e9e7ef]'
              }`}
            >
              Mode Ujian Siswa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analisis-hasil')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'analisis-hasil'
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-[#444651] hover:text-[#1a1b21] hover:bg-[#e9e7ef]'
              }`}
            >
              Analisis Hasil
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
