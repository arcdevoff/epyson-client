'use client';
import React from 'react';
import 'react-quill/dist/quill.bubble.css';
import './MainEditor.scss';
import dynamic from 'next/dynamic';

const MainEditor = ({ placeholder, value, setValue }) => {
  const ReactQuill = React.useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  return (
    <ReactQuill
      theme="bubble"
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      modules={{
        toolbar: ['bold', 'italic', 'underline', 'strike', 'link', 'blockquote', 'clean'],
        clipboard: { matchVisual: false },
      }}
    />
  );
};

export default MainEditor;
