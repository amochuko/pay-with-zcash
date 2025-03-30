type TagsProps = {
  tags: string[];
};
const Tags = (props: TagsProps) => {
  return (
    <div className="flex flex-wrap space-x-2 mb-4">
      {/* <!-- List of Tags --> */}
      {props.tags && props.tags.length > 0
        ? props.tags.slice(0, 3).map((tag, i) => (
            <span
              key={tag + "_" + i}
              className="bg-gray-300 text-gray-900 py-1 px-3 rounded-full text-sm mb-2"
            >
              {tag}
            </span>
          ))
        : null}
    </div>
  );
};

export default Tags;
