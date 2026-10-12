import { useState } from 'react';
import {
  HiOutlineArrowLeft,
  HiOutlineExclamation,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTag,
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineX,
} from 'react-icons/hi';
import { deletePost, updatePost } from '../services/api';
import type { Post } from '../types';

interface PostDetailsProps {
  post: Post;
  onBack: () => void;
  onUpdatePost: (updatedPost: Post) => void;
  onDeletePost: (id: number) => void;
}

export const PostDetails = ({
  post,
  onBack,
  onUpdatePost,
  onDeletePost,
}: PostDetailsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(post.title);
  const [editBody, setEditBody] = useState<string>(post.body);
  const [editTags, setEditTags] = useState<string>(post.tags.join(', '));
  const [actionError, setActionError] = useState<string | null>(null);

  const handleOpenEditModal = () => {
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditTags(post.tags.join(', '));
    setActionError(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isSubmitting) return;
    setIsEditModalOpen(false);
    setActionError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editBody.trim()) {
      setActionError('Title and body cannot be empty.');
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError(null);

      const parsedTags = editTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload = {
        title: editTitle.trim(),
        body: editBody.trim(),
        tags: parsedTags,
      };

      const updated = await updatePost(post.id, payload, post);

      onUpdatePost({
        ...post,
        ...updated,
        ...payload,
      });
      setIsEditModalOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      setActionError(null);
      await deletePost(post.id);
      setIsDeleteModalOpen(false);
      onDeletePost(post.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete post');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Posts
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEditModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <HiOutlinePencilAlt className="h-4 w-4 text-slate-500" />
            Edit
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100"
          >
            <HiOutlineTrash className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm font-medium text-rose-700">
          {actionError}
        </div>
      )}

      <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <HiOutlineUser className="h-3.5 w-3.5" />
            Author {post.userId}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Post ID {post.id}
          </span>
        </div>

        <div className="mt-8 space-y-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 capitalize sm:text-4xl sm:leading-tight">
            {post.title}
          </h1>

          <div className="rounded-2xl bg-slate-50 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
              {post.body}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 capitalize"
              >
                <HiOutlineTag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-4">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <HiOutlineThumbUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Likes</p>
              <p className="text-lg font-bold text-slate-800">{post.reactions.likes}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-rose-50/70 p-4">
            <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
              <HiOutlineThumbDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Dislikes</p>
              <p className="text-lg font-bold text-slate-800">{post.reactions.dislikes}</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-blue-50/70 p-4 sm:col-span-1">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <HiOutlineEye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Views</p>
              <p className="text-lg font-bold text-slate-800">{post.views.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </article>

      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={handleCloseEditModal}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Edit Post
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update title, content, and category tags.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={isSubmitting}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Body
                </label>
                <textarea
                  rows={5}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  required
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={() => !isSubmitting && setIsDeleteModalOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-8">
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
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
