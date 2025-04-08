import { useEditorContext } from "@/context/EditorContext";
import NotesSidebarActionsBtn from "./NotesSidebarActionsBtn";
import SearchBar from "./searchbar/SearchBar";
import NoteIcon from "@/components/svgs/NoteIcon";

interface Props {
  setCardView: React.Dispatch<React.SetStateAction<boolean>>;
}
const NotesSidebarHeader = ({ setCardView }: Props) => {
  const { filteredNotes } = useEditorContext();
  const notesLength = filteredNotes.length;
  return (
    <div className='pt-8 pl-4 pb-2 pr-3'>
      <h1 className='text-2xl font-semibold text-text flex items-center gap-2'>
        <NoteIcon />
        Notes
      </h1>
      <SearchBar />
      <div className='flex justify-between items-center py-0.5 mt-1'>
        <div className='text-sm text-text opacity-50'>{notesLength} notes</div>
        <NotesSidebarActionsBtn setCardView={setCardView} />
      </div>
    </div>
  );
};

export default NotesSidebarHeader;
