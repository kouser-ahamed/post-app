import { HiOutlineExclamation } from 'react-icons/hi';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}
      maxWidth="md"
      showCloseButton={false}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <HiOutlineExclamation className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Delete Post</h3>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
