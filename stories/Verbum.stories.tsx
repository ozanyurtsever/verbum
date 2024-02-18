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
  SuperscriptButton,
  SubscriptButton,
  StrikethroughButton
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
        <InsertDropdown />
        <Divider />
        <AlignDropdown />
      </ToolbarPlugin>
    </Editor>
  </EditorComposer>
);

const customSupportedBlockTypes = new Set([
  'paragraph',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'bullet',
  'number',
]);
export const CustomBlockType = () => (
  <EditorComposer initialEditorState={initialState}>
    <Editor>
      <ToolbarPlugin supportedBlockTypes={customSupportedBlockTypes} />
    </Editor>
  </EditorComposer>
);

export const HideUndoRedo = () => (
  <EditorComposer initialEditorState={initialState}>
    <Editor>
      <ToolbarPlugin hasUndoRedo={false} />
    </Editor>
  </EditorComposer>
);

export const NoBlockFormats = () => (
  <EditorComposer initialEditorState={initialState}>
    <Editor>
      <ToolbarPlugin supportedBlockTypes={new Set()} />
    </Editor>
  </EditorComposer>
);

const pluginModification = { characterStylesPopup: false }
export const NoCharacterStylesPopup = () => (
  <EditorComposer initialEditorState={initialState}>
    <Editor plugins={ pluginModification }>
      <ToolbarPlugin />
    </Editor>
  </EditorComposer >
);

const iWantEmojis = { emojis: true }
export const AutoEmojis = () => (
  <EditorComposer initialEditorState={initialState}>
    <Editor plugins={ iWantEmojis }>
      <ToolbarPlugin />
    </Editor>
  </EditorComposer >
);

export const SpecialFormatsAsIcons = () => (
  <EditorComposer initialEditorState={initialState}>
    <Editor>
      <ToolbarPlugin>
        <SuperscriptButton />
        <SubscriptButton />
        <StrikethroughButton />
      </ToolbarPlugin>
    </Editor>
  </EditorComposer>
);