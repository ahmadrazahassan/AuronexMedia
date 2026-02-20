import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  label?: string;
  error?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  label,
  error,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2 font-sf-pro">
          {label}
        </label>
      )}
      <div className="border-2 border-gray-300 rounded-card overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('bold') ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('italic') ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('bulletList') ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            Bullet List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('orderedList') ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            Numbered List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('blockquote') ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            Quote
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('link') ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            Link
          </button>
          <button
            type="button"
            onClick={addImage}
            className="px-3 py-1 text-sm rounded bg-white text-primary"
          >
            Image
          </button>
        </div>
        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-sf-pro">{error}</p>
      )}
    </div>
  );
};
