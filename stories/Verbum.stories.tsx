import React from 'react';
import { Meta } from '@storybook/react';
import { EditorComposer, Editor } from '../src';
import PlaygroundApp from '../src/App';
import ToolbarPlugin from '../src/plugins/ToolbarPlugin/ToolbarPlugin';

const meta: Meta = {
  title: 'Welcome',
  component: PlaygroundApp,
};

export default meta;

export const FullEditor = () => (
  <EditorComposer>
    <Editor>
      <ToolbarPlugin />
    </Editor>
  </EditorComposer>
);
export const Toolbar = () => (
  <EditorComposer>
    <ToolbarPlugin />
  </EditorComposer>
);
