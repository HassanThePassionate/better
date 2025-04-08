import ExtensionBtn from "./ExtensionBtn";

const ExtensionsBtns = () => {
  return (
    <div className='hidden md:grid grid-cols-2 gap-3 mt-4'>
      <ExtensionBtn
        name='Chrome Extension'
        icon='https://bookmarkmanager.com/brand/Google/Chrome.svg'
      />
      <ExtensionBtn
        name='Safari (coming soon)'
        icon='https://bookmarkmanager.com/brand/Apple/Safari.svg'
      />
      <ExtensionBtn
        name='Edge Extension'
        icon='https://bookmarkmanager.com/brand/Microsoft/Edge.svg'
      />
      <ExtensionBtn
        name='Firefox Add-On'
        icon='https://bookmarkmanager.com/brand/Mozilla/Firefox.svg'
      />
    </div>
  );
};

export default ExtensionsBtns;
