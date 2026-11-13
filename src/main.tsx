import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[TKA GURU] Caught an unhandled error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ffdbce] text-[#a73a00] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">refresh</span>
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">TKA GURU SDN 1 Purwasari</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Terjadi kendala saat memuat data aplikasi di browser. Silakan muat ulang atau pulihkan data bawaan sekolah.
            </p>
            <div className="flex gap-2 w-full pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 rounded-xl bg-[#00236f] text-white text-xs font-bold hover:bg-[#1e3a8a] transition-all cursor-pointer"
              >
                Muat Ulang Halaman
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
