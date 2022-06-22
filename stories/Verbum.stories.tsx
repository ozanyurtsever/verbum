import React from 'react';
import { EditorComposer, Editor } from '../src';
import ToolbarPlugin from '../src/plugins/ToolbarPlugin/ToolbarPlugin';
import AlignDropdown from '../src/plugins/ToolbarPlugin/components/AlignDropdown';
import InsertDropdown from '../src/plugins/ToolbarPlugin/components/InsertDropdown';

export default {
  title: 'Verbum',
};

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
