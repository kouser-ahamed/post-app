import { useState } from 'react';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { createPost } from '../services/api';
import type { Post } from '../types';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  onSelectPost: (id: number) => void;
  onPostCreated: (newPost: Post) => void;
}

export const PostList = ({
  posts,
  isLoading,
  error,
  onSelectPost,
  onPostCreated,
}: PostListProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setTitle('');
    setBody('');
    setTags('');
    setSubmitError(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsCreateModalOpen(false);
    setSubmitError(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setSubmitError('Title and body are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const parsedTags = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const created = await createPost({
        title: title.trim(),
        body: body.trim(),
        tags: parsedTags,
        userId: 1,
      });

      onPostCreated(created);
      setIsCreateModalOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Community Posts
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Explore thoughts, ideas, and updates from creators.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:self-auto"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Create Post
        </button>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-72 animate-pulse rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
            >
              <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="h-4 w-2/3 rounded bg-slate-100" />
              </div>
              <div className="mt-6 flex gap-2">
                <div className="h-5 w-14 rounded-full bg-slate-200" />
                <div className="h-5 w-16 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
          <p className="text-lg font-medium">No posts available right now.</p>
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Create New Post
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Share your thoughts and updates with the community.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {submitError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  placeholder="Write your post content..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
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
                  placeholder="history, crime, fiction"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
