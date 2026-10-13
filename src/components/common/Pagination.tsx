import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:mt-12 sm:gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3.5 sm:text-sm"
      >
        <HiOutlineChevronLeft className="h-4 w-4" />
        <span className="hidden xs:inline">Prev</span>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageItem, idx) =>
          typeof pageItem === 'number' ? (
            <button
              key={pageItem}
              onClick={() => onPageChange(pageItem)}
              className={`h-8 w-8 rounded-xl text-xs font-semibold transition sm:h-9 sm:w-9 sm:text-sm ${
                currentPage === pageItem
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageItem}
            </button>
          ) : (
            <span
              key={`dots-${idx}`}
              className="px-1 text-xs text-slate-400 sm:px-2 sm:text-sm"
            >
              ...
            </span>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3.5 sm:text-sm"
      >
        <span className="hidden xs:inline">Next</span>
        <HiOutlineChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};
