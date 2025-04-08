"use client";

import { EditorContent } from "@tiptap/react";
import "./editor.styles.css";
import EditorToolbar from "./EditorToolbar";
import EditorBubbleMenu from "./EditorBubbleMenu";
import EditorFloatingMenu from "./EditorFloatingMenu";
import { useEditorContext } from "@/context/EditorContext";

export default function RichTextEditor() {
  const { editor } = useEditorContext();
  return (
    <div className='border border-border lg:rounded-md   h-screen lg:max-h-screen overflow-auto max-w-screen sm:w-screen '>
      <EditorToolbar />
      <EditorBubbleMenu />
      <EditorFloatingMenu />
      <div className='p-4 prose prose-sm sm:prose max-w-none editor-content'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
