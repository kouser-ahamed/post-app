import { HiOutlineEye, HiOutlineThumbDown, HiOutlineThumbUp, HiOutlineUser } from 'react-icons/hi';
import type { PostReactions as PostReactionsType } from '../../../types';

export interface PostReactionsProps {
  reactions: PostReactionsType;
  views: number;
  userId: number;
}

export const PostReactions = ({
  reactions,
  views,
  userId,
}: PostReactionsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500">
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="inline-flex items-center gap-1.5 text-emerald-600">
          <HiOutlineThumbUp className="h-4 w-4 shrink-0" />
          {reactions.likes}
        </span>

        <span className="inline-flex items-center gap-1.5 text-rose-500">
          <HiOutlineThumbDown className="h-4 w-4 shrink-0" />
          {reactions.dislikes}
        </span>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className="inline-flex items-center gap-1 text-slate-500">
          <HiOutlineEye className="h-4 w-4 shrink-0" />
          {views.toLocaleString()}
        </span>

        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          <HiOutlineUser className="h-3 w-3 shrink-0" />
          User {userId}
        </span>
      </div>
    </div>
  );
};
