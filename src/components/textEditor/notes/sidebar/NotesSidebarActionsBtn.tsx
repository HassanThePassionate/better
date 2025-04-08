import { Sorting } from "./Sorting";
import { View } from "./View";

interface Props {
  setCardView: React.Dispatch<React.SetStateAction<boolean>>;
}
const NotesSidebarActionsBtn = ({ setCardView }: Props) => {
  return (
    <div className='flex gap-1 items-center'>
      <Sorting />
      <View setCardView={setCardView} />
    </div>
  );
};

export default NotesSidebarActionsBtn;
