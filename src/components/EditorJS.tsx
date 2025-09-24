'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list';

interface EditorComponentProps {
  onSaveRef: React.MutableRefObject<(() => Promise<any>) | null>;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ onSaveRef }) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        list: List,
      },
      data: {
        blocks: [],
      },
    });

    editorRef.current = editor;

    // Set the onSaveRef to access outside
    onSaveRef.current = async () => {
      const savedData = await editor.save();
      return savedData;
    };

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [onSaveRef]);

  return (
    <div className="mt-6 space-y-2">
      <label className="text-sm font-medium">Product Description</label>
      <div id="editorjs" className="border rounded-lg p-4 bg-white text-black" />
    </div>
  );
};

export default EditorComponent;
