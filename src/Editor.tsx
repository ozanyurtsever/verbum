/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import React, { ReactNode, useEffect, useState } from 'react';
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
import { LexicalEditor } from 'lexical';
import { useTranslation } from 'react-i18next';
import DragDropPaste from './plugins/DragDropPastePlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';

interface IEditorProps {
  children?: ReactNode;
  hashtagsEnabled?: boolean;
  autoLinkEnabled?: boolean;
  emojisEnabled?: boolean;
  emojiPickerEnabled?: boolean;
  actionsEnabled?: boolean;
  placeholder?: string;
  listMaxIndent?: number;
  isEditable?: boolean;
  locale?: 'en' | 'fr' | 'ptBr' | 'ru' | 'tr' | 'de' | null;
  onChange?: (editorState: string, editorInstance?: LexicalEditor) => void;
}

const Editor = ({
  children,
  hashtagsEnabled = false,
  autoLinkEnabled = false,
  emojisEnabled = false,
  emojiPickerEnabled = false,
  actionsEnabled = false,
  listMaxIndent = 7,
  placeholder = '',
  isEditable = true,
  locale = null,
  onChange,
}: IEditorProps) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [_isEditable, setIsEditable] = useState(isEditable);
  const editorStateRef = useRef(null);
  const { historyState } = useSharedHistoryContext();
  const {
    settings: { isRichText },
  } = useSettings();
  const placeholderComponent = <Placeholder>{placeholder}</Placeholder>;

  const { i18n } = useTranslation();

  useEffect(() => {
    editor.setEditable(isEditable);

    setIsEditable(isEditable);

    if (locale) i18n.changeLanguage(locale);
  }, [isEditable]);

  return (
    <EditorContext.Provider
      value={{ initialEditor: editor, activeEditor, setActiveEditor }}
    >
      {children}
      <div className={`editor-container`}>
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        {hashtagsEnabled && <HashtagPlugin />}
        {emojisEnabled && <EmojisPlugin />}
        {emojiPickerEnabled && <EmojiPickerPlugin />}
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <DragDropPaste />
        {autoLinkEnabled && <AutoLinkPlugin />}

        <>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={placeholderComponent}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              onChange?.(JSON.stringify(editorState), activeEditor);
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
          {_isEditable && <CharacterStylesPopupPlugin />}
          <TabFocusPlugin />
        </>

        <HistoryPlugin externalHistoryState={historyState} />
        {actionsEnabled && <ActionsPlugin isRichText={isRichText} />}
      </div>
    </EditorContext.Provider>
  );
};

export default Editor;
