"use client";

import type React from "react";
import { useCallback } from "react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  TableIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ToolbarButtonGroup from "./ToolbarButtonGroup";
import ToolbarButton from "./ToolbarButton";
import LinkPopover from "./popovers/linkPopover";
import ImagePopover from "./popovers/ImagePopover";
import ColorPopover from "./popovers/ColorPopover";
import { useEditorContext } from "@/context/EditorContext";

export default function EditorToolbar() {
  const { editor, linkUrl, setLinkUrl, imageUrl, setImageUrl, fileInputRef } =
    useEditorContext();
  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const url =
      !linkUrl.startsWith("http") &&
      !linkUrl.startsWith("/") &&
      !linkUrl.startsWith("#")
        ? `https://${linkUrl}`
        : linkUrl;

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setLinkUrl("");
  }, [editor, linkUrl, setLinkUrl]);

  const addImage = useCallback(() => {
    if (!editor) return;

    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
    }
  }, [editor, imageUrl, setImageUrl]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor || !event.target.files || event.target.files.length === 0)
        return;

      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        }
      };
      reader.readAsDataURL(file);

      // Reset the file input
      if (event.target) {
        event.target.value = "";
      }
    },
    [editor]
  );

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const addTable = useCallback(() => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  return (
    <div className='p-2 border-b bg-muted/40 sticky  top-0 z-40 bg-background '>
      <div className='flex flex-wrap items-center gap-1 mb-2'>
        <ToolbarButtonGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title='Bold'
            icon={<Bold className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title='Italic'
            icon={<Italic className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title='Underline'
            icon={<UnderlineIcon className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title='Strikethrough'
            icon={<Strikethrough className='h-4 w-4' />}
          />
        </ToolbarButtonGroup>

        <Separator orientation='vertical' className='mx-1 h-6' />

        <ToolbarButtonGroup>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            title='Heading 1'
            icon={<Heading1 className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title='Heading 2'
            icon={<Heading2 className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title='Heading 3'
            icon={<Heading3 className='h-4 w-4' />}
          />
        </ToolbarButtonGroup>

        <Separator orientation='vertical' className='mx-1 h-6' />

        <ToolbarButtonGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title='Bullet List'
            icon={<List className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title='Ordered List'
            icon={<ListOrdered className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title='Blockquote'
            icon={<Quote className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            title='Code Block'
            icon={<Code className='h-4 w-4' />}
          />
        </ToolbarButtonGroup>

        <Separator orientation='vertical' className='mx-1 h-6' />

        <ToolbarButtonGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title='Align Left'
            icon={<AlignLeft className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title='Align Center'
            icon={<AlignCenter className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title='Align Right'
            icon={<AlignRight className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            title='Justify'
            icon={<AlignJustify className='h-4 w-4' />}
          />
        </ToolbarButtonGroup>

        <Separator orientation='vertical' className='mx-1 h-6' />

        <ToolbarButtonGroup>
          <LinkPopover
            editor={editor}
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            setLink={setLink}
          />

          <ImagePopover
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            addImage={addImage}
            triggerImageUpload={triggerImageUpload}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
          />

          <ToolbarButton
            onClick={addTable}
            title='Insert Table'
            icon={<TableIcon className='h-4 w-4' />}
          />

          <ColorPopover editor={editor} />
        </ToolbarButtonGroup>

        <Separator orientation='vertical' className='mx-1 h-6' />

        <ToolbarButtonGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title='Undo'
            icon={<Undo className='h-4 w-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title='Redo'
            icon={<Redo className='h-4 w-4' />}
          />
        </ToolbarButtonGroup>
      </div>
    </div>
  );
}
