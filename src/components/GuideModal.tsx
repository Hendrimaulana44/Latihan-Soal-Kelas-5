import React from 'react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#a73a00] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#0F172A]">
                Panduan Kisi-kisi &amp; Standar Soal TKA SD
              </h3>
              <span className="text-xs text-[#64748B]">
                Standar BSKAP Kemendikbudristek &amp; SDN 1 Purwasari
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

        <div className="flex flex-col gap-4 pt-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-[#f4f3fa] border border-slate-200">
            <h4 className="font-bold text-sm text-[#00236f] mb-1">
              1. Prinsip Penyusunan Stimulus Kontekstual
            </h4>
            <p>
              Setiap kelompok 3 butir soal wajib didahului 1 stimulus orisinal yang berakar pada kearifan
              lokal pedesaan SDN 1 Purwasari (kegiatan pasar, pertanian padi organik, proyek P5, festival
              sekolah). Hindari soal teoretis tanpa konteks dunia nyata.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f4f3fa] border border-slate-200">
            <h4 className="font-bold text-sm text-[#00236f] mb-1">
              2. Distribusi Rasio Kognitif (40% : 40% : 20%)
            </h4>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>
                <strong>LOTS (40% / 10 Soal):</strong> Mengingat rumus dasar, membaca tabel harga, konversi
                satuan langsung.
              </li>
              <li>
                <strong>MOTS (40% / 14 Soal):</strong> Menghitung diskon berlapis, perbandingan dua
                kondisi belanja, pecahan volume teko.
              </li>
              <li>
                <strong>HOTS (20% / 6 Soal):</strong> Menilai kebenaran argumen, menghitung laba rugi
                kewirausahaan, menganalisis solusi paling hemat.
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f4f3fa] border border-slate-200">
            <h4 className="font-bold text-sm text-[#00236f] mb-1">
              3. Variasi Tipe Soal Terstandar
            </h4>
            <p>
              TKA Guru mendukung 3 format utama: Pilihan Ganda Tunggal (1 kunci benar), Pilihan Ganda
              Kompleks (pilihlah lebih dari 1 opsi yang sesuai), dan Matriks Benar / Salah untuk
              menguji ketelitian logika siswa.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-emerald-200 text-emerald-900">
            <h4 className="font-bold text-sm text-[#059669] mb-1">
              4. Sinkronisasi Google Sheets &amp; Drive Otomatis
            </h4>
            <p>
              Guru cukup menekan <em>"Simpan ke Google Sheets"</em> setelah validasi butir soal selesai.
              Hasil pengerjaan siswa melalui mode ujian CBT akan langsung tercatat di sheet{' '}
              <code>HasilUjian</code>.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00236f] text-white text-xs font-bold cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
