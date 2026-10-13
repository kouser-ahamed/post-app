import { HiOutlineArrowLeft, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { Button } from '../../common/Button';

export interface PostDetailsHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostDetailsHeader = ({
  onBack,
  onEdit,
  onDelete,
}: PostDetailsHeaderProps) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <Button
        variant="secondary"
        onClick={onBack}
        leftIcon={<HiOutlineArrowLeft className="h-4 w-4" />}
      >
        Back to Posts
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={onEdit}
          leftIcon={<HiOutlinePencilAlt className="h-4 w-4 text-slate-500" />}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          onClick={onDelete}
          leftIcon={<HiOutlineTrash className="h-4 w-4" />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
