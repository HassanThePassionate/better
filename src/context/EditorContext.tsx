"use client";

import type React from "react";

import {
  createContext,
  Dispatch,
  type RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { useEditor, type Editor } from "@tiptap/react";
import { editorExtensions } from "@/components/textEditor/EditorExtensions";

type Notes = {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  des: string;
  color: string;
}[];

type EditorContextProps = {
  editor: Editor;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  filteredNotes: Notes;
  selectedNoteId: number;
  addNewNote: () => void;
  deleteNote: (id: number) => void;
  selectNote: (id: number) => void;
  setNotes: Dispatch<
    SetStateAction<
      {
        id: number;
        title: string;
        des: string;
        content: string;
        updatedAt: string;
        createdAt: string;
        color: string;
      }[]
    >
  >;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedColor: string; // Keep for backward compatibility
  setSelectedColor: (color: string) => void; // Keep for backward compatibility
  setNoteColor: (noteId: number, color: string) => void; // New function to set color for specific note
};

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const EditorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const currentTime = new Date().toISOString();
  const [searchTerm, setSearchTerm] = useState("");
  const DEFAULT_TITLE = "Untitled";

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: DEFAULT_TITLE,
      des: "",
      content: `<h1>${DEFAULT_TITLE}</h1><p>Start writing...</p>`,
      updatedAt: currentTime,
      createdAt: currentTime,
      color: "", // Initialize with empty color
    },
  ]);

  const filteredNotes =
    searchTerm.trim() === ""
      ? notes
      : notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.des.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedNoteId, setSelectedNoteId] = useState(1);

  // Set color for a specific note
  const setNoteColor = (noteId: number, color: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              color: color,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );

    // Also update selectedColor for backward compatibility
    if (noteId === selectedNoteId) {
      setSelectedColor(color);
    }
  };

  const editor = useEditor({
    extensions: editorExtensions,
    content:
      filteredNotes.find((note) => note.id === selectedNoteId)?.content || "",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const jsonContent = editor.getJSON().content || [];

      // Get the current note's title or use default
      const currentNote = filteredNotes.find(
        (note) => note.id === selectedNoteId
      );
      let newTitle = currentNote?.title || DEFAULT_TITLE;
      let newDescription = "";
      let firstHeadingFound = false;

      // Extract title from first heading if it exists
      jsonContent.forEach((block) => {
        if (block.type === "heading" && !firstHeadingFound) {
          // Only update title if the heading has actual text content
          const headingText = block.content?.[0]?.text?.trim();
          if (headingText) {
            newTitle = headingText;
            firstHeadingFound = true;
          }
        } else if (block.content) {
          newDescription +=
            block.content.map((c) => c.text || "").join(" ") + " ";
        }
      });

      // Ensure title is never empty
      if (!newTitle || newTitle.trim() === "") {
        newTitle = DEFAULT_TITLE;
      }

      // If no heading is found in the content, ensure there's a heading at the top
      if (!firstHeadingFound) {
        // Check if the first block is a paragraph that might have been a heading
        const firstBlock = jsonContent[0];
        if (firstBlock && firstBlock.type === "paragraph") {
          const paragraphText = firstBlock.content?.[0]?.text?.trim();
          if (paragraphText) {
            newTitle = paragraphText;

            // Convert the paragraph back to a heading in the editor
            setTimeout(() => {
              const { from, to } = editor.state.selection;
              editor
                .chain()
                .focus()
                .setNodeSelection(0)
                .setNode("heading", { level: 1 })
                .run();
              // Fix the setTextSelection command to use an object with from and to properties
              editor.commands.setTextSelection({ from, to });
            }, 0);
          }
        }
      }

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNoteId
            ? {
                ...note,
                title: newTitle,
                des: newDescription.trim(),
                content: htmlContent,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
    },
  });

  const addNewNote = () => {
    const currentTime = new Date().toISOString();
    const newNote = {
      id: Date.now(),
      title: DEFAULT_TITLE,
      des: "",
      content: `<h1>${DEFAULT_TITLE}</h1><p>Start writing...</p>`,
      updatedAt: currentTime,
      createdAt: currentTime,
      color: "", // Initialize with empty color
    };
    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
    editor?.commands.setContent(newNote.content);
  };

  const deleteNote = (id: number) => {
    if (notes.length === 1) return;

    const noteIndex = filteredNotes.findIndex((note) => note.id === id);

    const updatedNotes = filteredNotes.filter((note) => note.id !== id);

    if (selectedNoteId === id) {
      let newSelectedIndex;
      if (noteIndex > 0) {
        newSelectedIndex = noteIndex - 1;
      } else {
        newSelectedIndex = 0;
      }

      const newSelectedId = updatedNotes[newSelectedIndex].id;
      setSelectedNoteId(newSelectedId);
      editor?.commands.setContent(updatedNotes[newSelectedIndex].content);

      // Update selectedColor when changing selected note
      setSelectedColor(updatedNotes[newSelectedIndex].color || "");
    }

    setNotes(updatedNotes);
  };

  const selectNote = (id: number) => {
    setSelectedNoteId(id);
    const selectedNote = filteredNotes.find((note) => note.id === id);
    if (selectedNote) {
      editor?.commands.setContent(selectedNote.content);
      // Update selectedColor when changing selected note
      setSelectedColor(selectedNote.color || "");
    }
  };

  if (!editor) return null;

  return (
    <EditorContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        linkUrl,
        setLinkUrl,
        filteredNotes,
        imageUrl,
        setImageUrl,
        selectedNoteId,
        fileInputRef,
        editor,
        addNewNote,
        deleteNote,
        selectNote,
        setNotes,
        searchTerm,
        setSearchTerm,
        setNoteColor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error(
      "useEditorContext must be used within a EditorContextProvider"
    );
  }
  return context;
};
