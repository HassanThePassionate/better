import Card from "./Card";

import ShortcutBox from "./ShortcutBox";
import DocDropdown from "./Dropdown";

const Recent = () => {
  return (
    <Card>
      <div className='flex items-center justify-between'>
        <h2 className='text-base text-text font-medium'>Recent Docs</h2>
        <DocDropdown />
      </div>
      <div className='mt-2 flex items-center gap-3 max-[600px]:flex-wrap'>
        <ShortcutBox text='Untitled' />
      </div>
    </Card>
  );
};

export default Recent;
