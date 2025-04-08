import Card from "./Card";
import ShortcutBox from "./ShortcutBox";

const Workspace = () => {
  return (
    <Card>
      <h2 className='text-base text-text font-medium'>Google Workspace</h2>
      <div className='mt-2 flex items-center gap-3 max-[600px]:flex-wrap'>
        <ShortcutBox text='Gmail' />
        <ShortcutBox text='Calendar' />
        <ShortcutBox text='New meet' />
        <ShortcutBox text='Drive' />
        <ShortcutBox text='Account' />
      </div>
    </Card>
  );
};

export default Workspace;
