import { HiOutlineSparkles } from 'react-icons/hi';
import { RiArticleLine } from 'react-icons/ri';

interface NavbarProps {
  onHomeClick: () => void;
}

export const Navbar = ({ onHomeClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={onHomeClick}
          className="group flex items-center gap-2.5 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition group-hover:bg-indigo-600">
            <RiArticleLine className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="block text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Post<span className="text-indigo-600">Pulse</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Community Stories
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:px-3">
            <HiOutlineSparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">DummyJSON API</span>
            <span className="sm:hidden">API</span>
          </span>
        </div>
      </div>
    </header>
  );
};
