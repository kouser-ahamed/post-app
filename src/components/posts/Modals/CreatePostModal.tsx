import { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { PostFormFields } from '../PostForm/PostFormFields';
import { parseTagsString, validatePostForm } from '../../../schemas/postSchema';
import type { PostFormData, PostFormErrors } from '../../../types';

export interface CreatePostModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; body: string; tags: string[]; userId: number }) => void;
  error?: string | null;
}

export const CreatePostModal = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
  error,
}: CreatePostModalProps) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    body: '',
    tags: '',
  });
  const [clientErrors, setClientErrors] = useState<PostFormErrors>({});

  const handleChange = (field: keyof PostFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setFormData({ title: '', body: '', tags: '' });
    setClientErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePostForm(formData);
    if (!validation.isValid) {
      setClientErrors(validation.errors);
      return;
    }

    const tags = parseTagsString(formData.tags);
    onSubmit({
      title: formData.title.trim(),
      body: formData.body.trim(),
      tags,
      userId: 1,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Post"
      description="Share your thoughts and updates with the community."
      maxWidth="2xl"
    >
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <PostFormFields
          formData={formData}
          errors={clientErrors}
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 sm:pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Create Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};
