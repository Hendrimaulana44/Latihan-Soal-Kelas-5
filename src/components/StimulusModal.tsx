import React, { useState } from 'react';
import { Stimulus } from '../types';

interface StimulusModalProps {
  onSave: (stimulus: Stimulus) => void;
  onClose: () => void;
}

export const StimulusModal: React.FC<StimulusModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [storyText, setStoryText] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD3ILbE_LFe0MvhDYf_33QwplchXwZc3fJDQiU-KidyMGOTZJard3WH3vF1rbnA_gNMSHAYrrE5Qb_-ns6bT7VP-bG4IFVnnq8xMTDiEuJMzpg2SVJ0GzzxlKRdW2FcnDTL8AUBmAjcc-Joacfgrf9VuOFYo4-EdOLqHChKS8w495eD9ujcTpvt1esZzxbr6FtwKJFDW692z0R2ct_16kkcSSCQ3FrYJvXPi_UVSlw'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !storyText.trim()) return;

    const newStim: Stimulus = {
      id: `stim-${Date.now()}`,
      title,
      context: context || 'Kearifan Lokal SDN 1 Purwasari',
      storyText,
      imageUrl: imageUrl || undefined,
      tableData: {
        headers: ['Kategori / Bahan', 'Takaran / Harga', 'Keterangan'],
        rows: [
          ['Item Utama', 'Satuan Standar', 'Tercatat'],
          ['Item Pendukung', 'Pilihan Bebas', 'Pelengkap'],
        ],
      },
    };

    onSave(newStim);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">post_add</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#0F172A]">Tambah Stimulus Baru</h3>
              <span className="text-xs text-[#64748B]">
                Konteks Narasi &amp; Data Numerasi Kearifan Lokal
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
          <div>
            <label className="text-xs font-semibold text-slate-700">Judul Stimulus</label>
            <input
              type="text"
              required
              placeholder="e.g. Kegiatan Panen Padi Sawah Organik Purwasari"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Konteks Singkat</label>
            <input
              type="text"
              placeholder="e.g. Pembelajaran Numerasi Terpadu Lingkungan Pedesaan"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Teks Cerita / Situasi Stimulus</label>
            <textarea
              rows={4}
              required
              placeholder="Tuliskan cerita kontekstual yang memuat data numerasi atau bacaan intensif..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white text-xs text-[#0F172A] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Link Foto / Ilustrasi (Opsional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f4f3fa] text-xs text-[#0F172A] border border-slate-200 focus:outline-none"
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
              Simpan Stimulus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
