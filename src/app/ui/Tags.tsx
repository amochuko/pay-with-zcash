type TagsProps = {
  tags: string[];
};

const Tags = ({ tags }: TagsProps) => {
  if (!tags || tags.length === 0) return null;

  const visible = tags.slice(0, 2);
  const overflow = tags.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((tag, i) => (
        <span
          key={`${tag}_${i}`}
          title={tag}
          className="inline-flex max-w-[100px] items-center truncate rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 sm:max-w-[140px] sm:text-xs"
        >
          {tag}
        </span>
      ))}
      {overflow > 0 && (
        <span className="inline-flex shrink-0 items-center rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 sm:text-xs">
          +{overflow}
        </span>
      )}
    </div>
  );
};
export default Tags;
