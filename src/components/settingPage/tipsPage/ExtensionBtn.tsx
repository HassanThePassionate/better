const ExtensionBtn = ({ name, icon }: { name: string; icon: string }) => {
  return (
    <div>
      <a
        target='_blank'
        className='no-underline flex flex-shrink items-center justify-center border rounded-md px-8 py-3 gap-3 border-border  hover:bg-hover  bg-card'
        href='#'
      >
        <img src={icon} alt={name} className='w-8 h-8' />
        <span>{name}</span>
      </a>
    </div>
  );
};

export default ExtensionBtn;
