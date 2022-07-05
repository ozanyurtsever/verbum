/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoScrollPlugin } from '@lexical/react/LexicalAutoScrollPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import React, { ReactNode, useState } from 'react';
import { useRef } from 'react';

import { useSettings } from './context/SettingsContext';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
import ActionsPlugin from './plugins/ActionsPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CharacterStylesPopupPlugin from './plugins/CharacterStylesPopupPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import EditorContext from './context/EditorContext';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $getSelection } from 'lexical';

interface IEditorProps {
  children?: ReactNode;
  hashtagsEnabled?: boolean;
  autoLinkEnabled?: boolean;
  emojisEnabled?: boolean;
  placeholder?: string;
  listMaxIndent?: number;
  initialEditorState?: string;
  onChange?: (editorState) => void;
}

const Editor = ({
  children,
  hashtagsEnabled = false,
  autoLinkEnabled = false,
  emojisEnabled = false,
  listMaxIndent = 7,
  placeholder = '',
  initialEditorState,
  onChange,
}: IEditorProps) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const editorStateRef = useRef(null);
  const { historyState } = useSharedHistoryContext();
  const {
    settings: { isCollab, isRichText, emptyEditor },
  } = useSettings();
  const placeholderComponent = <Placeholder>{placeholder}</Placeholder>;
  const scrollRef = useRef(null);

  return (
    <EditorContext.Provider
      value={{ initialEditor: editor, activeEditor, setActiveEditor }}
    >
      {children}
      <div className={`editor-container`} ref={scrollRef}>
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        {hashtagsEnabled && <HashtagPlugin />}
        {emojisEnabled && <EmojisPlugin />}
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        {autoLinkEnabled && <AutoLinkPlugin />}
        <AutoScrollPlugin scrollRef={scrollRef} />

        <>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={placeholderComponent}
            initialEditorState={initialEditorState}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              onChange?.(JSON.stringify(editorState));
              return (editorStateRef.current = editorState);
            }}
          />
          <MarkdownShortcutPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={listMaxIndent} />
          <LinkPlugin />
          <ClickableLinkPlugin />
          <CharacterStylesPopupPlugin />
          <TabFocusPlugin />
        </>

        <HistoryPlugin externalHistoryState={historyState} />
        <ActionsPlugin isRichText={isRichText} />
      </div>
    </EditorContext.Provider>
  );
};

export default Editor;
