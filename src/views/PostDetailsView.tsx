import { useState } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { usePost } from '../hooks/usePost';
import { usePostMutations } from '../hooks/usePostMutations';
import { PostDetailsHeader } from '../components/posts/PostDetails/PostDetailsHeader';
import { PostDetailsBody } from '../components/posts/PostDetails/PostDetailsBody';
import { EditPostModal } from '../components/posts/Modals/EditPostModal';
import { DeleteConfirmModal } from '../components/posts/Modals/DeleteConfirmModal';
import { Button } from '../components/common/Button';
import type { UpdatePostPayload } from '../types';

export interface PostDetailsViewProps {
  postId: number;
  onBack: () => void;
}

export const PostDetailsView = ({ postId, onBack }: PostDetailsViewProps) => {
  const { data: post, isLoading, isError, error, refetch } = usePost(postId);
  const { updateMutation, deleteMutation } = usePostMutations();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleOpenEdit = () => {
    setActionError(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setActionError(null);
  };

  const handleUpdateSubmit = async (id: number, payload: UpdatePostPayload) => {
    try {
      setActionError(null);
      await updateMutation.mutateAsync({
        id,
        payload,
        currentPost: post,
      });
      setIsEditModalOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update post');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionError(null);
      await deleteMutation.mutateAsync(postId);
      setIsDeleteModalOpen(false);
      onBack();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  if (isLoading && !post) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-96 animate-pulse rounded-3xl border border-slate-200/60 bg-white p-8" />
      </div>
    );
  }

  if (isError && !post) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center space-y-4">
        <p className="font-semibold text-rose-700">
          {error?.message || 'Failed to load post details.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={onBack}>
            Back to Posts
          </Button>
          <Button variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
        <p className="text-slate-600">Post not found.</p>
        <Button
          variant="secondary"
          onClick={onBack}
          leftIcon={<HiOutlineArrowLeft className="h-4 w-4" />}
        >
          Back to Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PostDetailsHeader
        onBack={onBack}
        onEdit={handleOpenEdit}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {actionError && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm font-medium text-rose-700">
          {actionError}
        </div>
      )}

      <PostDetailsBody post={post} />

      <EditPostModal
        isOpen={isEditModalOpen}
        isLoading={updateMutation.isPending}
        post={post}
        onClose={handleCloseEdit}
        onSubmit={handleUpdateSubmit}
        error={actionError}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        isLoading={deleteMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
