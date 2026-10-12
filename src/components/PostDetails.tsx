import { useEffect, useState } from 'react';
import {
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineTag,
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiOutlineUser,
} from 'react-icons/hi';
import { fetchPostById } from '../services/api';
import type { Post } from '../types';

interface PostDetailsProps {
  postId: number;
  initialPost?: Post;
  onBack: () => void;
}

export const PostDetails = ({ postId, initialPost, onBack }: PostDetailsProps) => {
  const [fetchedPost, setFetchedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPost);
  const [error, setError] = useState<string | null>(null);

  const post = initialPost && initialPost.id === postId ? initialPost : fetchedPost;

  useEffect(() => {
    if (initialPost && initialPost.id === postId) {
      return;
    }

    const controller = new AbortController();

    const loadPost = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchPostById(postId, controller.signal);

        if (controller.signal.aborted) return;

        setFetchedPost(data);
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

    loadPost();

    return () => {
      controller.abort();
    };
  }, [postId, initialPost]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Posts
        </button>
        <div className="animate-pulse rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-6 w-24 rounded-full bg-slate-200" />
          </div>
          <div className="mt-6 h-8 w-3/4 rounded bg-slate-200" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Posts
        </button>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Posts
        </button>
        <div className="animate-pulse rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-6 w-24 rounded-full bg-slate-200" />
          </div>
          <div className="mt-6 h-8 w-3/4 rounded bg-slate-200" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Posts
      </button>

      <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center gap-2">
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

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <HiOutlineUser className="h-3.5 w-3.5" />
              Author #{post.userId}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              Post ID #{post.id}
            </span>
          </div>
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
    </div>
  );
};
