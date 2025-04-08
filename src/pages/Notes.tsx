import RichTextEditor from "@/components/textEditor";
import NotesPageLayout from "./layout/NotesPageLayout";
import { EditorContextProvider } from "@/context/EditorContext";

const Notes = () => {
  return (
    <EditorContextProvider>
      <NotesPageLayout>
        <RichTextEditor />
      </NotesPageLayout>
    </EditorContextProvider>
  );
};

export default Notes;
