import React, { useState } from 'react';
import { Student } from '../types';

interface ManageStudentsModalProps {
  students: Student[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onClose: () => void;
}

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  students,
  onSaveStudent,
  onDeleteStudent,
  onClose,
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [nisn, setNisn] = useState('');
  const [grade, setGrade] = useState<number>(4);
  const [classGroup, setClassGroup] = useState('Kelas 4A');

  const filtered = students.filter((s) => {
    if (filterClass !== 'all' && s.classGroup !== filterClass) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.nisn.includes(q)) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nisn) return;
    const newStudent: Student = {
      id: `siswa-${Date.now()}`,
      name,
      nisn,
      grade,
      classGroup,
      guardianTeacher: 'Ibu Ratna Dewi, S.Pd.',
    };
    onSaveStudent(newStudent);
    setName('');
    setNisn('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#0F172A]">Kelola Siswa &amp; NISN</h3>
              <span className="text-xs text-[#64748B]">
                Basis Data Siswa SDN 1 Purwasari (Sheet Siswa)
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

        {/* Action & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs font-medium text-[#0F172A] focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Rombel</option>
              <option value="Kelas 4A">Kelas 4A</option>
              <option value="Kelas 4B">Kelas 4B</option>
              <option value="Kelas 5A">Kelas 5A</option>
              <option value="Kelas 6A">Kelas 6A</option>
            </select>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-2 rounded-xl bg-[#a73a00] hover:bg-[#C2410C] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>{showAddForm ? 'Batal' : '+ Siswa'}</span>
            </button>
          </div>
        </div>

        {/* Add Student Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="p-4 rounded-2xl bg-[#FFF7ED] border border-orange-200/60 mb-4 flex flex-col gap-3 animate-in fade-in"
          >
            <div className="text-xs font-bold text-[#a73a00]">Tambah Siswa Baru</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmad Fauzan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">NISN (10 Digit)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0129845730"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Tingkat Kelas</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                >
                  <option value={1}>Kelas 1</option>
                  <option value={2}>Kelas 2</option>
                  <option value={3}>Kelas 3</option>
                  <option value={4}>Kelas 4</option>
                  <option value={5}>Kelas 5</option>
                  <option value={6}>Kelas 6</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Rombel / Kelas</label>
                <select
                  value={classGroup}
                  onChange={(e) => setClassGroup(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                >
                  <option value="Kelas 4A">Kelas 4A</option>
                  <option value="Kelas 4B">Kelas 4B</option>
                  <option value="Kelas 5A">Kelas 5A</option>
                  <option value="Kelas 6A">Kelas 6A</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#a73a00] text-white text-xs font-bold cursor-pointer"
              >
                Simpan Siswa
              </button>
            </div>
          </form>
        )}

        {/* Student Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3fa] text-[#0F172A] font-semibold">
              <tr>
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">NISN</th>
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-3">Guru Wali</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#0F172A]">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-[#64748B]">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#00236f]">{s.nisn}</td>
                  <td className="py-2.5 px-3 font-medium">{s.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#eeedf4] text-[11px] font-medium">
                      {s.classGroup}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#64748B]">{s.guardianTeacher}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Hapus siswa ${s.name}?`)) {
                          onDeleteStudent(s.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
