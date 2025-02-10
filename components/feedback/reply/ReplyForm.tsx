'use client';

import React, { useState, Fragment } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import SuccessModal from '@/components/feedback/SuccessModal';

import { 
  Bold, 
  Italic, 
  Link2, 
  List, 
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  ChevronDown,
  IndentIcon,
  OutdentIcon
} from 'lucide-react';

interface ReplyFormProps {
  onSubmit?: (data: { title: string; content: string }) => void;
  onSave?: (data: { title: string; content: string }) => void;
}

// Komponen MenuBar terpisah untuk toolbar
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    
    <div className="flex items-center gap-1 p-1 mb-2 border rounded-lg bg-white">
      {/* Paragraph Dropdown */}
      <div className="relative">
        <button className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded">
          <span className="text-sm">Paragraph</span>
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="w-[1px] h-6 bg-gray-200 mx-1" />

      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 hover:bg-gray-100 rounded ${
          editor.isActive('bold') ? 'bg-gray-100' : ''
        }`}
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 hover:bg-gray-100 rounded ${
          editor.isActive('italic') ? 'bg-gray-100' : ''
        }`}
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleLink().run()}
        className={`p-2 hover:bg-gray-100 rounded ${
          editor.isActive('link') ? 'bg-gray-100' : ''
        }`}
      >
        <Link2 size={18} />
      </button>

      <div className="w-[1px] h-6 bg-gray-200 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 hover:bg-gray-100 rounded ${
          editor.isActive('bulletList') ? 'bg-gray-100' : ''
        }`}
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 hover:bg-gray-100 rounded ${
          editor.isActive('orderedList') ? 'bg-gray-100' : ''
        }`}
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-[1px] h-6 bg-gray-200 mx-1" />

      {/* Indentation */}
      <button
        onClick={() => editor.chain().focus().outdent().run()}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <OutdentIcon size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().indent().run()}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <IndentIcon size={18} />
      </button>

      <div className="w-[1px] h-6 bg-gray-200 mx-1" />

      {/* Quote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 hover:bg-gray-100 rounded ${
          editor.isActive('blockquote') ? 'bg-gray-100' : ''
        }`}
      >
        <Quote size={18} />
      </button>

      <div className="w-[1px] h-6 bg-gray-200 mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Undo2 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Redo2 size={18} />
      </button>
    </div>
  );
};

const ReplyForm = ({ onSubmit, onSave }: ReplyFormProps) => {
  const [title, setTitle] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    editorProps: {
      attributes: {
        class: 'min-h-[150px] w-[620px] rounded-lg border border-[#EAEAEA] bg-white p-3 focus:outline-none prose prose-sm max-w-none'
      }
    }
  });

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        title,
        content: editor?.getHTML() || ''
      });
      setShowSuccessModal(true); 
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        title,
        content: editor?.getHTML() || ''
      });
    }
  };

  return (
    <>
      <div className="flex flex-col p-6 gap-5 rounded-2xl border border-[#C0C0C0] shadow-[0px_6px_14px_0px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="flex justify-between items-center py-2.5">
          <h2 className="text-[18px] font-medium leading-[150%] tracking-[0.5px] text-[#CF0000]">
            Balas Feedback
          </h2>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
              Judul*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukan Judul Balasan Feedback"
              className="w-full h-[46px] px-2.5 rounded-lg border border-[#EAEAEA] bg-white text-sm font-normal leading-[150%] tracking-[0.5px] text-[#828282] focus:outline-none"
            />
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
              Isi Balasan*
            </label>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-[15px] py-2.5 rounded-lg bg-[#EAEAEA] text-sm font-medium leading-[150%] tracking-[0.5px] text-[#303030]"
            >
              Simpan
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2.5 rounded-lg bg-[#CF0000] text-sm font-medium leading-[150%] tracking-[0.5px] text-[#FBFBFC]"
            >
              Kirim Feedback
            </button>
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

export default ReplyForm;