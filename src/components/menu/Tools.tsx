import Card from "./Card";
import ShortcutBox from "./ShortcutBox";

const Tools = () => {
  return (
    <Card>
      <h2 className='text-base text-text font-medium'>Chrome Tools</h2>
      <div className='mt-2 flex items-center gap-3 max-[600px]:flex-wrap'>
        <ShortcutBox text='Incognito' />
        <ShortcutBox text='New window' />
        <ShortcutBox text='History' />
        <ShortcutBox text='Download' />
        <ShortcutBox text='Clear history' />
      </div>
    </Card>
  );
};

export default Tools;
