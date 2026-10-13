import { HiOutlineArrowRight } from 'react-icons/hi';
import type { Post } from '../../../types';
import { PostTags } from './PostTags';
import { PostReactions } from './PostReactions';

export interface PostCardProps {
  post: Post;
  onSelect: (id: number) => void;
}

export const PostCard = ({ post, onSelect }: PostCardProps) => {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="space-y-3.5">
        <div className="space-y-2">
          <h2 className="line-clamp-2 text-lg font-bold tracking-tight text-slate-900 capitalize sm:text-xl">
            {post.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 sm:line-clamp-4">
            {post.body}
          </p>
        </div>

        {/* Tags placed strictly BELOW the paragraph */}
        <PostTags tags={post.tags} />
      </div>

      <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
        <PostReactions
          reactions={post.reactions}
          views={post.views}
          userId={post.userId}
        />

        <button
          onClick={() => onSelect(post.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
        >
          View Details
          <HiOutlineArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};
