import { usePageContext } from "@/context/PageContext";

const Logo = () => {
  const { setPage } = usePageContext();
  const goHome = () => setPage("bookmarks");
  return (
    <button
      onClick={goHome}
      className='flex  items-center justify-center rounded-full '
    >
      <img
        src='https://bookmarkmanager.com/logo/icon.svg'
        alt='Bookmark Manager Logo Icon'
        className='w-10 h-10'
      />
    </button>
  );
};

export default Logo;
