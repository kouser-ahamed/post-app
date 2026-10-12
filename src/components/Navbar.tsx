import { HiOutlineDocumentText, HiOutlineSparkles } from 'react-icons/hi';

interface NavbarProps {
  onHomeClick?: () => void;
}

export const Navbar = ({ onHomeClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2.5 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <HiOutlineDocumentText className="h-6 w-6" />
          </div>
          <div className="text-left">
            <span className="block text-base font-bold tracking-tight text-slate-900 leading-none">
              Postify
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Community Explorer
            </span>
          </div>
        </button>

        <nav className="flex items-center gap-3">
          <button
            onClick={onHomeClick}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Posts
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <HiOutlineSparkles className="h-3.5 w-3.5" />
            DummyJSON API
          </span>
        </nav>
      </div>
    </header>
  );
};
