import React from 'react';
import { Meta } from '@storybook/react';
import { EditorComposer, Editor } from '../src';
import PlaygroundApp from '../src/App';
import ToolbarPlugin from '../src/plugins/ToolbarPlugin/ToolbarPlugin';
import AlignDropdown from '../src/plugins/ToolbarPlugin/components/AlignDropdown';
import { LexicalEditor } from 'lexical';
import InsertDropdown from '../src/plugins/ToolbarPlugin/components/InsertDropdown';

const meta: Meta = {
  title: 'Welcome',
  component: PlaygroundApp,
};

export default meta;

export const FullEditor = () => (
  <EditorComposer>
    <Editor>
      <ToolbarPlugin>
        <InsertDropdown />
        <AlignDropdown />
      </ToolbarPlugin>
    </Editor>
  </EditorComposer>
);
export const Toolbar = () => (
  <EditorComposer>
    <ToolbarPlugin />
  </EditorComposer>
);
