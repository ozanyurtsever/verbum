import { LexicalComposer } from '@lexical/react/LexicalComposer';
import React, { useState } from 'react';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import './EditorComposer.css';

interface IEditorComposer {
  children: React.ReactElement;
}

const EditorComposer = ({ children }: IEditorComposer) => {
  const initialConfig = {
    namespace: 'VerbumEditor',
    nodes: [...PlaygroundNodes],
    onError: (error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-shell">{children}</div>
    </LexicalComposer>
  );
};

export default EditorComposer;
