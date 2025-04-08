import Card from "./Card";
import ShortcutBox from "./ShortcutBox";

const MostVisited = () => {
  return (
    <Card>
      <h2 className='text-base text-text font-medium'>Most Visited</h2>
      <div className='mt-2 flex items-center gap-3 max-[600px]:flex-wrap'>
        <ShortcutBox text='Google' />
        <ShortcutBox text='Youtube' />
        <ShortcutBox text='Foxified' />
        <ShortcutBox text='Auto Edit' />
        <ShortcutBox text='Download' />
      </div>
    </Card>
  );
};

export default MostVisited;
