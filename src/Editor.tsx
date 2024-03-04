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
  plugins?: IEnabledEditorPlugins;
  placeholder?: string;
  listMaxIndent?: number;
  isEditable?: boolean;
  locale?: 'en' | 'fr' | 'ptBr' | 'ru' | 'tr' | 'de' | null;
  onChange?: (editorState: string, editorInstance?: LexicalEditor) => void;
}

interface IEnabledEditorPlugins {
  hashtags?: boolean;
  autoLink?: boolean;
  emojis?: boolean;
  emojiPicker?: boolean;
  actions?: boolean;
  autofocus?: boolean;
  clearEditor?: boolean;
  keywords?: boolean;
  speechToText?: boolean;
  dragDropPaste?: boolean;
  markdownShortcut?: boolean;
  codeHighlight?: boolean;
  list?: boolean;
  checkList?: boolean;
  listMaxIndent?: boolean;
  link?: boolean;
  clickableLink?: boolean;
  characterStylesPopup?: boolean;
  tabFocus?: boolean;
  history?: boolean;
}

const DEFAULT_EDITOR_PLUGINS: IEnabledEditorPlugins = {
  hashtags: false,
  autoLink: false,
  emojis: false,
  emojiPicker: false,
  actions: false,
  autofocus: true,
  clearEditor: true,
  keywords: true,
  speechToText: true,
  dragDropPaste: true,
  markdownShortcut: true,
  codeHighlight: true,
  list: true,
  checkList: true,
  listMaxIndent: true,
  link: true,
  clickableLink: true,
  characterStylesPopup: true,
  tabFocus: true,
  history: true,
};

const Editor = ({
  children,
  plugins = {},
  listMaxIndent = 7,
  placeholder = '',
  isEditable = true,
  locale = null,
  onChange,
}: IEditorProps) => {
  const enabledPlugins = { ...DEFAULT_EDITOR_PLUGINS, ...plugins };

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const editorStateRef = useRef(null);
  const { historyState } = useSharedHistoryContext();
  const {
    settings: { isRichText },
  } = useSettings();
  const placeholderComponent = <Placeholder>{placeholder}</Placeholder>;

  const { i18n } = useTranslation();

  useEffect(() => {
    editor.setEditable(isEditable);

    if (locale) i18n.changeLanguage(locale);
  }, []);

  return (
    <EditorContext.Provider
      value={{ initialEditor: editor, activeEditor, setActiveEditor }}
    >
      {children}
      <div className={`editor-container`}>
        {enabledPlugins.autofocus && <AutoFocusPlugin />}
        {enabledPlugins.clearEditor && <ClearEditorPlugin />}
        {enabledPlugins.hashtags && <HashtagPlugin />}
        {enabledPlugins.emojis && <EmojisPlugin />}
        {enabledPlugins.emojiPicker && <EmojiPickerPlugin />}
        {enabledPlugins.keywords && <KeywordsPlugin />}
        {enabledPlugins.speechToText && <SpeechToTextPlugin />}
        {enabledPlugins.dragDropPaste && <DragDropPaste />}
        {enabledPlugins.autoLink && <AutoLinkPlugin />}

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
          {enabledPlugins.markdownShortcut && <MarkdownShortcutPlugin />}
          {enabledPlugins.codeHighlight && <CodeHighlightPlugin />}
          {enabledPlugins.list && <ListPlugin />}
          {enabledPlugins.checkList && <CheckListPlugin />}
          {enabledPlugins.listMaxIndent && <ListMaxIndentLevelPlugin maxDepth={listMaxIndent} />}
          {enabledPlugins.link && <LinkPlugin />}
          {enabledPlugins.clickableLink && <ClickableLinkPlugin />}
          {enabledPlugins.characterStylesPopup && <CharacterStylesPopupPlugin />}
          {enabledPlugins.tabFocus && <TabFocusPlugin />}
        </>

        {enabledPlugins.history && <HistoryPlugin externalHistoryState={historyState} />}
        {enabledPlugins.actions && <ActionsPlugin isRichText={isRichText} />}
      </div>
    </EditorContext.Provider>
  );
};

export default Editor;
