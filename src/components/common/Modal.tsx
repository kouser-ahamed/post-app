import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { HiOutlineX } from 'react-icons/hi';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = '2xl',
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Card without internal vertical scrollbars */}
      <div
        className={`relative w-full ${maxWidthStyles} overflow-visible rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl transition-all sm:p-8`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5">
            <div>
              {title && (
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                aria-label="Close modal"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className={title ? 'mt-5' : ''}>{children}</div>
      </div>
    </div>
  );
};
