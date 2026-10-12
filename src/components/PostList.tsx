import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/api';
import type { Post } from '../types';
import { PostCard } from './PostCard';

interface PostListProps {
  onSelectPost: (id: number) => void;
  onLoadedPosts?: (posts: Post[]) => void;
}

export const PostList = ({ onSelectPost, onLoadedPosts }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchPosts(controller.signal);

        if (controller.signal.aborted) return;

        setPosts(data.posts);
        onLoadedPosts?.(data.posts);
      } catch (err: unknown) {
        const isAbort =
          controller.signal.aborted ||
          (typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name === 'AbortError');

        if (isAbort) return;

        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      controller.abort();
    };
  }, [onLoadedPosts]);

  return (
    <div>
      <header className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Community Posts
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Explore thoughts, ideas, and updates from creators.
        </p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-2">
                <div className="h-5 w-14 rounded-full bg-slate-200" />
                <div className="h-5 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="h-4 w-2/3 rounded bg-slate-100" />
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

      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={onSelectPost}
            />
          ))}
        </div>
      )}
    </div>
  );
};
