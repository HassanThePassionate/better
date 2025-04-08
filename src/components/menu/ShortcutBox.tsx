const ShortcutBox = ({ text }: { text: string }) => {
  return (
    <a href='#' className='flex items-center flex-col'>
      <div className='h-[60px] w-[60px] rounded-md bg-card flex items-center justify-center hover:bg-badge'>
        <img
          src='/google.png'
          alt='google'
          className='h-4 w-4'
          loading='lazy'
        />
      </div>
      <div className='relative w-[60px] overflow-hidden'>
        <span className='text-[13px] font-medium text-text whitespace-nowrap block text-center'>
          {text}
        </span>
        <div className='absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-input pointer-events-none'></div>
      </div>
    </a>
  );
};

export default ShortcutBox;
