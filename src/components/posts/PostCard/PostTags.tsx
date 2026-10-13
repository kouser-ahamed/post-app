export interface PostTagsProps {
  tags: string[];
}

export const PostTags = ({ tags }: PostTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize"
        >
          {tag.replace(/^#+/, '')}
        </span>
      ))}
    </div>
  );
};
