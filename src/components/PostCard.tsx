import { HiOutlineArrowRight, HiOutlineEye, HiOutlineThumbDown, HiOutlineThumbUp, HiOutlineUser } from 'react-icons/hi';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onSelect: (id: number) => void;
}

export const PostCard = ({ post, onSelect }: PostCardProps) => {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 capitalize">
            {post.title}
          </h2>
          <p className="line-clamp-4 text-sm leading-relaxed text-slate-600">
            {post.body}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600">
              <HiOutlineThumbUp className="h-4 w-4" />
              {post.reactions.likes}
            </span>

            <span className="inline-flex items-center gap-1.5 text-rose-500">
              <HiOutlineThumbDown className="h-4 w-4" />
              {post.reactions.dislikes}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-slate-500">
              <HiOutlineEye className="h-4 w-4" />
              {post.views.toLocaleString()}
            </span>

            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
              <HiOutlineUser className="h-3 w-3" />
              User {post.userId}
            </span>
          </div>
        </div>

        <button
          onClick={() => onSelect(post.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View Details
          <HiOutlineArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};
