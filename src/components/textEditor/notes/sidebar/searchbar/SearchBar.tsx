import { SearchInput } from "@/components/addNewFolder/SearchInput";
import Button from "@/components/ui/my-button";
import { useEditorContext } from "@/context/EditorContext";
import { CgNotes } from "react-icons/cg";

const SearchBar = () => {
  const { searchTerm, setSearchTerm, addNewNote } = useEditorContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className='mt-4 mb-4'>
      <SearchInput
        className='border bg-input rounded-md h-[40px] flex items-center text-text'
        value={searchTerm}
        setValue={setSearchTerm}
        onChange={handleChange}
        placeholder='Search...'
      />
      <Button
        className='bg-brand mt-3  text-text-primary w-full justify-center hover:bg-brand-hover '
        onClick={addNewNote}
      >
        <CgNotes size={18} className='mr-1' />
        Add Note
      </Button>
    </div>
  );
};

export default SearchBar;
