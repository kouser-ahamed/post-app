import { useState } from 'react';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { usePosts } from '../hooks/usePosts';
import { usePostMutations } from '../hooks/usePostMutations';
import { PostCard } from '../components/posts/PostCard/PostCard';
import { Pagination } from '../components/common/Pagination';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { CreatePostModal } from '../components/posts/Modals/CreatePostModal';

export interface PostsViewProps {
  onSelectPost: (id: number) => void;
}

export const PostsView = ({ onSelectPost }: PostsViewProps) => {
  const {
    filteredPosts,
    paginatedPosts,
    totalPages,
    currentPage,
    setCurrentPage,
    searchInput,
    setSearchInput,
    debouncedSearch,
    clearSearch,
    isLoading,
    isError,
    error,
    refetch,
  } = usePosts();

  const { createMutation } = usePostMutations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setCreateError(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateError(null);
  };

  const handleCreateSubmit = async (payload: {
    title: string;
    body: string;
    tags: string[];
    userId: number;
  }) => {
    try {
      setCreateError(null);
      await createMutation.mutateAsync(payload);
      setIsCreateModalOpen(false);
      setCurrentPage(1);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create post');
    }
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
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <HiOutlineX className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            onClick={handleOpenCreateModal}
            leftIcon={<HiOutlinePlus className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            Create Post
          </Button>
        </div>
      </header>

      {debouncedSearch && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-sm text-slate-600 shadow-sm sm:px-4">
          <span>
            Search results for: <strong className="text-slate-900">"{debouncedSearch}"</strong>
            {!isLoading && ` (${filteredPosts.length} found)`}
          </span>
          <button
            onClick={clearSearch}
            className="text-xs font-semibold text-slate-900 underline hover:text-slate-600"
          >
            Clear Search
          </button>
        </div>
      )}

      {isLoading && <Skeleton count={9} />}

      {isError && !isLoading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 space-y-3">
          <p className="font-semibold">{error?.message || 'Failed to load posts'}</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && filteredPosts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <HiOutlineSearch className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-medium text-slate-700 sm:text-lg">
            {debouncedSearch
              ? `No posts found matching "${debouncedSearch}"`
              : 'No posts available right now.'}
          </p>
          {debouncedSearch && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearSearch}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {!isLoading && !isError && paginatedPosts.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <PostCard key={post.id} post={post} onSelect={onSelectPost} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        isLoading={createMutation.isPending}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateSubmit}
        error={createError}
      />
    </div>
  );
};
