import React from 'react';
import { EditorComposer, Editor, Divider } from '../src';
import ToolbarPlugin from '../src/plugins/ToolbarPlugin/ToolbarPlugin';

import {
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
} from '../src/plugins/ToolbarPlugin/components';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

export default {
  title: 'Verbum',
};

const initialState = () => {
  const paragraph = $createParagraphNode();
  const text = $createTextNode('Hello World!');
  paragraph.append(text);
  const root = $getRoot();
  root.append(paragraph);
  root.selectEnd();
};

const uploadImage = () => {
  return {
    url: "https://www.w3schools.com/images/w3schools_green.jpg"
  };
}

export const FullEditor = () => (
  <EditorComposer initialEditorState={initialState}>
    <Editor>
      <ToolbarPlugin>
        <FontFamilyDropdown />
        <FontSizeDropdown />
        <Divider />
        <BoldButton />
        <ItalicButton />
        <UnderlineButton />
        <CodeFormatButton />
        <InsertLinkButton />
        <TextColorPicker />
        <BackgroundColorPicker />
        <TextFormatDropdown />
        <Divider />
        <InsertDropdown uploadImage={uploadImage}/>
        <Divider />
        <AlignDropdown />
      </ToolbarPlugin>
    </Editor>
  </EditorComposer>
);
