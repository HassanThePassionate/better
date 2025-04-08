import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import { Extension } from "@tiptap/core"

const PreserveHeadingOnBackspace = Extension.create({
  name: "preserveHeadingOnBackspace",

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state
        const { empty, $from } = selection
        if (!empty || $from.pos !== $from.start() || !$from.parent.type.name.startsWith("heading")) {
          return false
        }

        return true
      },
    }
  },
})

const CustomHeading = Heading.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Backspace: ({ editor }) => {
        const { selection } = editor.state
        const { empty, $from } = selection

        if (!empty || $from.pos !== $from.start()) {
          return false
        }
        return true
      },
    }
  },
})


export const editorExtensions = [
  CustomHeading,
  PreserveHeadingOnBackspace,
  StarterKit.configure({
    // Disable the built-in heading extension
    heading: false,
    paragraph: {
      HTMLAttributes: {
        class: "paragraph",
      },
    },
    bulletList: {
      keepMarks: true,
      keepAttributes: true,
      HTMLAttributes: {
        class: "bullet-list",
      },
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: true,
      HTMLAttributes: {
        class: "ordered-list",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "list-item",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "blockquote",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "code-block",
      },
    },
    code: {
      HTMLAttributes: {
        class: "code",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "horizontal-rule",
      },
    },
  }),
  // Add a custom heading extension with proper class handling
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: {
      class: (attributes: { level: number }) => `h${attributes.level}`,
    },
  }),
  Underline.configure({
    HTMLAttributes: {
      class: "underline",
    },
  }),
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: "link text-primary underline cursor-pointer",
    },
    validate: (href) =>
      /^https?:\/\//.test(href) || href.startsWith("/") || href.startsWith("#"),
  }),
  Image.configure({
    HTMLAttributes: {
      class: "image rounded-md max-w-full",
    },
    allowBase64: true,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "rich-table",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "rich-table-row",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: "rich-table-header",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "rich-table-cell",
    },
  }),
  TextStyle.configure({
    HTMLAttributes: {
      class: "text-style",
    },
  }),
  Color,
];
