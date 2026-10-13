import {
  HiOutlineEye,
  HiOutlineTag,
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiOutlineUser,
} from 'react-icons/hi';
import type { Post } from '../../../types';

export interface PostDetailsBodyProps {
  post: Post;
}

export const PostDetailsBody = ({ post }: PostDetailsBodyProps) => {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8 md:p-10">
      {/* Header Info: User/Author and Post IDs without '#' */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 sm:pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <HiOutlineUser className="h-3.5 w-3.5" />
          Author {post.userId}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          Post ID {post.id}
        </span>
      </div>

      <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 capitalize sm:text-3xl md:text-4xl md:leading-tight">
          {post.title}
        </h1>

        <div className="rounded-2xl bg-slate-50 p-5 sm:p-7 md:p-8">
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base md:text-lg">
            {post.body}
          </p>
        </div>

        {/* Tags placed strictly BELOW paragraph and without '#' */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 capitalize"
            >
              <HiOutlineTag className="h-3 w-3" />
              {tag.replace(/^#+/, '')}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="mt-8 grid grid-cols-2 gap-3.5 border-t border-slate-100 pt-6 sm:grid-cols-3 sm:gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3.5 sm:p-4">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
            <HiOutlineThumbUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Likes</p>
            <p className="text-base font-bold text-slate-800 sm:text-lg">
              {post.reactions.likes}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-rose-50/70 p-3.5 sm:p-4">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
            <HiOutlineThumbDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Dislikes</p>
            <p className="text-base font-bold text-slate-800 sm:text-lg">
              {post.reactions.dislikes}
            </p>
          </div>
        </div>

        <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-blue-50/70 p-3.5 sm:col-span-1 sm:p-4">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
            <HiOutlineEye className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Views</p>
            <p className="text-base font-bold text-slate-800 sm:text-lg">
              {post.views.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
