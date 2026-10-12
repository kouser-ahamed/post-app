import { useMemo, useRef, useState } from 'react';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineX,
} from 'react-icons/hi';
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

const POSTS_PER_PAGE = 9;

export const PostList = ({
  posts,
  isLoading,
  error,
  onSelectPost,
  onPostCreated,
}: PostListProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newBody, setNewBody] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(val.trim());
      setCurrentPage(1);
    }, 350);
  };

  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchInput('');
    setDebouncedQuery('');
    setCurrentPage(1);
  };

  const filteredPosts = useMemo(() => {
    if (!debouncedQuery) return posts;
    const q = debouncedQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [posts, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleOpenModal = () => {
    setNewTitle('');
    setNewBody('');
    setNewTags('');
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
    if (!newTitle.trim() || !newBody.trim()) {
      setSubmitError('Title and body are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const parsedTags = newTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const created = await createPost({
        title: newTitle.trim(),
        body: newBody.trim(),
        tags: parsedTags,
        userId: 1,
      });

      onPostCreated(created);
      setCurrentPage(1);
      setIsCreateModalOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPageNumbers = () => {
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
    <div>
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Community Posts
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
            Explore thoughts, ideas, and updates from creators.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64 md:w-72">
            <HiOutlineSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="Search posts..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <HiOutlineX className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto"
          >
            <HiOutlinePlus className="h-5 w-5" />
            Create Post
          </button>
        </div>
      </header>

      {debouncedQuery && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-sm text-slate-600 shadow-sm sm:px-4">
          <span>
            Search results for: <strong className="text-slate-900">"{debouncedQuery}"</strong>
            {!isLoading && ` (${filteredPosts.length} found)`}
          </span>
          <button
            onClick={handleClearSearch}
            className="text-xs font-semibold text-slate-900 underline hover:text-slate-600"
          >
            Clear Search
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-68 animate-pulse rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm sm:h-72 sm:p-6"
            >
              <div className="mt-2 h-5 w-3/4 rounded bg-slate-200" />
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

      {!isLoading && !error && filteredPosts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <HiOutlineSearch className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-medium text-slate-700 sm:text-lg">
            {debouncedQuery
              ? `No posts found matching "${debouncedQuery}"`
              : 'No posts available right now.'}
          </p>
          {debouncedQuery && (
            <button
              onClick={handleClearSearch}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && paginatedPosts.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <PostCard key={post.id} post={post} onSelect={onSelectPost} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:mt-12 sm:gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage(pageItem)}
                      className={`h-8 w-8 rounded-xl text-xs font-semibold transition sm:h-9 sm:w-9 sm:text-sm ${
                        currentPage === pageItem
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageItem}
                    </button>
                  ) : (
                    <span key={`dots-${idx}`} className="px-1 text-xs text-slate-400 sm:px-2 sm:text-sm">
                      ...
                    </span>
                  ),
                )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3.5 sm:text-sm"
              >
                <span className="hidden xs:inline">Next</span>
                <HiOutlineChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </>
      )}

      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl transition-all sm:max-h-none sm:max-w-2xl sm:overflow-visible sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Create New Post
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
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
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 sm:text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="mt-5 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter post title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
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
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 sm:pt-5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 sm:px-6"
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
