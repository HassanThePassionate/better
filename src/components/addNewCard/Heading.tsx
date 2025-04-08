import NewBookmarkIcon from "../svgs/NewBookmarkIcon";

const Heading = () => {
  return (
    <h2 className='px-4 py-6 sm:p-8 sm:pt-0 text-xl font-semibold leading-7 text-text  flex items-center justify-center gap-3'>
      <NewBookmarkIcon />
      New Bookmark
    </h2>
  );
};

export default Heading;
