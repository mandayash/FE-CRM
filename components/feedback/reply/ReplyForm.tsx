"use client";

import React, { useState, Fragment } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter } from 'next/navigation';
import SuccessSendFeedback from "@/components/feedback/modals/SuccessSendFeedback";

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
  ArrowLeft,
  OutdentIcon
} from 'lucide-react';

interface ReplyFormProps {
  onSubmit?: (data: { title?: string; content: string }) => void;
  onSave?: (data: { title?: string; content: string }) => void;
  showTitleInput?: boolean;
}

// Komponen MenuBar terpisah untuk toolbar
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 mb-2 border rounded-lg bg-white overflow-x-auto">
      {/* Paragraph Dropdown */}
      <div className="relative">
        <button className="flex items-center gap-1 p-1.5 sm:p-2 hover:bg-gray-100 bg-white rounded">
          <span className="text-xs sm:text-sm">Paragraph</span>
          <ChevronDown size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="w-[1px] h-6 bg-gray-200 mx-1" />

      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded ${
          editor.isActive("bold") ? "bg-gray-100" : ""
        }`}
      >
        <Bold size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded ${
          editor.isActive("italic") ? "bg-gray-100" : ""
        }`}
      >
        <Italic size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleLink().run()}
        className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded ${
          editor.isActive("link") ? "bg-gray-100" : ""
        }`}
      >
        <Link2 size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <div className="w-[1px] h-6 bg-gray-200 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded ${
          editor.isActive("bulletList") ? "bg-gray-100" : ""
        }`}
      >
        <List size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded ${
          editor.isActive("orderedList") ? "bg-gray-100" : ""
        }`}
      >
        <ListOrdered size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <div className="w-[1px] h-5 sm:h-6 bg-gray-200 mx-1" />

      {/* Indentation */}
      <button
        onClick={() => editor.chain().focus().outdent().run()}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
      >
        <OutdentIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <button
        onClick={() => editor.chain().focus().indent().run()}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
      >
        <IndentIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <div className="w-[1px] h-5 sm:h-6 bg-gray-200 mx-1" />

      {/* Quote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded ${
          editor.isActive("blockquote") ? "bg-gray-100" : ""
        }`}
      >
        <Quote size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <div className="w-[1px] h-5 sm:h-6 bg-gray-200 mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
      >
        <Undo2 size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
      >
        <Redo2 size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  );
};

const ReplyForm = ({ onSubmit, onSave, showTitleInput = false }: ReplyFormProps) => {
  const [title, setTitle] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full rounded-lg border border-[#EAEAEA] bg-white p-3 focus:outline-none prose prose-sm max-w-none",
      },
    },
  });

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        title: showTitleInput ? title : undefined,
        content: editor?.getHTML() || ''
      });
      setShowSuccessModal(true); 
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        title: showTitleInput ? title : undefined,
        content: editor?.getHTML() || ''
      });
    }
  };

  return (
    <>
      <div className="bg-white flex flex-col p-4 sm:p-6 gap-4 sm:gap-5 rounded-2xl border border-[#C0C0C0] shadow-[0px_6px_14px_0px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-medium text-[#CF0000]">
              Balas Feedback
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 sm:space-y-5">
          {/* Title Input */}
          {/* <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
              Judul*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukan Judul Balasan Feedback"
              className="w-full h-10 sm:h-[46px] px-2.5 rounded-lg border border-[#EAEAEA] bg-white text-xs sm:text-sm font-normal leading-[150%] tracking-[0.5px] text-[#828282] focus:outline-none"
            />
          </div> */}

          {/* Editor */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
              Isi Balasan*
            </label>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-3 sm:px-[15px] py-2 sm:py-2.5 rounded-lg bg-[#EAEAEA] text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#303030]"
            >
              Simpan
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#CF0000] text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#FBFBFC]"
            >
              Kirim Feedback
            </button>
          </div>
        </div>
      </div>

      <SuccessSendFeedback
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

export default ReplyForm;
