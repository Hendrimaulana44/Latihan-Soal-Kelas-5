import React, { useState } from 'react';
import { AppSettings, Teacher, ExamPackage, Student, ExamResult } from '../types';

interface AdminSettingsModalProps {
  settings: AppSettings;
  teachers: Teacher[];
  exams: ExamPackage[];
  students: Student[];
  results: ExamResult[];
  onSaveSettings: (s: AppSettings) => void;
  onSaveTeacher: (t: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onClose: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  settings,
  teachers,
  exams,
  students,
  results,
  onSaveSettings,
  onSaveTeacher,
  onDeleteTeacher,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'database'>('theme');
  const [formData, setFormData] = useState<AppSettings>({ ...settings });

  // Add teacher state
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherNip, setNewTeacherNip] = useState('');
  const [newTeacherClass, setNewTeacherClass] = useState('Kelas 4 SD');

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    alert('Pengaturan sekolah & tema berhasil diperbarui!');
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail) return;
    const t: Teacher = {
      id: `guru-${Date.now()}`,
      name: newTeacherName,
      email: newTeacherEmail,
      nip: newTeacherNip || '19800101 201001 1 001',
      role: 'Guru',
      assignedClasses: [newTeacherClass],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
    onSaveTeacher(t);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherNip('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffdbce] text-[#a73a00] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#0F172A]">
                Panel Pengaturan Administrator
              </h3>
              <span className="text-xs text-[#64748B]">
                SDN 1 Purwasari • Hak Akses Khusus Admin
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-4 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'theme'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Identitas Sekolah &amp; Tema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'profile'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Kelola Profil Guru ({teachers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'database'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Database Google Sheets
          </button>
        </div>

        {/* Tab 1: Theme & Identity */}
        {activeTab === 'theme' && (
          <form onSubmit={handleSaveTheme} className="flex flex-col gap-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Nama Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Tahun Ajaran</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.principalNip}
                  onChange={(e) => setFormData({ ...formData, principalNip: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Alamat Lengkap</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Teachers Management */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4 pt-4">
            {/* Add teacher */}
            <form
              onSubmit={handleAddTeacher}
              className="p-4 rounded-2xl bg-[#f4f3fa] flex flex-col gap-3"
            >
              <div className="text-xs font-bold text-[#00236f]">Daftarkan Guru Baru</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap & Gelar"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white text-xs text-slate-800 border border-slate-200 focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Akun Login"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white text-xs text-slate-800 border border-slate-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="NIP Guru"
                  value={newTeacherNip}
                  onChange={(e) => setNewTeacherNip(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white text-xs text-slate-800 border border-slate-200 focus:outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00236f] text-white text-xs font-bold cursor-pointer hover:bg-[#1e3a8a]"
                >
                  + Tambah Guru
                </button>
              </div>
            </form>

            {/* List */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f4f3fa] text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Nama Guru</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">NIP</th>
                    <th className="py-2.5 px-3">Peran</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-6 h-6 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span>{t.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{t.email}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{t.nip}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.role === 'Admin'
                              ? 'bg-[#dce1ff] text-[#00164e]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {t.role !== 'Admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus akun guru ${t.name}?`)) {
                                onDeleteTeacher(t.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Sheets Database Inspector */}
        {activeTab === 'database' && (
          <div className="flex flex-col gap-4 pt-4 text-xs">
            <div className="p-3 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span className="font-semibold">
                Struktur data Google Spreadsheet TKA GURU tersinkronisasi (PRD Bagian 4).
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#f4f3fa]">
                <div className="text-[11px] text-[#64748B]">Sheet 'Guru'</div>
                <div className="text-lg font-bold text-[#0F172A]">{teachers.length} Baris</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f4f3fa]">
                <div className="text-[11px] text-[#64748B]">Sheet 'Siswa'</div>
                <div className="text-lg font-bold text-[#0F172A]">{students.length} Baris</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f4f3fa]">
                <div className="text-[11px] text-[#64748B]">Sheet 'Naskah'</div>
                <div className="text-lg font-bold text-[#0F172A]">{exams.length} Paket</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f4f3fa]">
                <div className="text-[11px] text-[#64748B]">Sheet 'HasilUjian'</div>
                <div className="text-lg font-bold text-[#0F172A]">{results.length} Rekap</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed">
              Semua transaksi naskah, soal stimulus, dan hasil nilai ujian terlindungi oleh{' '}
              <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">
                LockService &amp; SpreadsheetApp
              </code>{' '}
              sebagaimana tertuang dalam spesifikasi arsitektur TKA GURU SDN 1 Purwasari.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
