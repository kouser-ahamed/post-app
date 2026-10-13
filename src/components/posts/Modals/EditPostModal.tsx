import { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { PostFormFields } from '../PostForm/PostFormFields';
import { parseTagsString, validatePostForm } from '../../../schemas/postSchema';
import type { Post, PostFormData, PostFormErrors, UpdatePostPayload } from '../../../types';

export interface EditPostModalProps {
  isOpen: boolean;
  isLoading: boolean;
  post: Post | null;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdatePostPayload) => void;
  error?: string | null;
}

interface EditPostFormProps {
  post: Post;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdatePostPayload) => void;
  error?: string | null;
}

const EditPostForm = ({
  post,
  isLoading,
  onClose,
  onSubmit,
  error,
}: EditPostFormProps) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: post.title,
    body: post.body,
    tags: post.tags.join(', '),
  });
  const [clientErrors, setClientErrors] = useState<PostFormErrors>({});

  const handleChange = (field: keyof PostFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePostForm(formData);
    if (!validation.isValid) {
      setClientErrors(validation.errors);
      return;
    }

    const tags = parseTagsString(formData.tags);
    onSubmit(post.id, {
      title: formData.title.trim(),
      body: formData.body.trim(),
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 sm:text-sm">
          {error}
        </div>
      )}

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
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export const EditPostModal = ({
  isOpen,
  isLoading,
  post,
  onClose,
  onSubmit,
  error,
}: EditPostModalProps) => {
  if (!isOpen || !post) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Post"
      description="Update title, content, and category tags."
      maxWidth="2xl"
    >
      <EditPostForm
        key={`${post.id}-${post.title}`}
        post={post}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={onSubmit}
        error={error}
      />
    </Modal>
  );
};
