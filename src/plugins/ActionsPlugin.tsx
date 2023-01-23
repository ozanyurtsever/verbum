/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';

import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { exportFile, importFile } from '@lexical/file';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { CONNECTED_COMMAND, TOGGLE_CONNECT_COMMAND } from '@lexical/yjs';
import {
  $createTextNode,
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import useModal from '../hooks/useModal';
import Button from '../ui/Button';
import { PLAYGROUND_TRANSFORMERS } from './MarkdownTransformers';
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from './SpeechToTextPlugin';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

export default function ActionsPlugin({
  isRichText,
}: {
  isRichText: boolean;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [modal, showModal] = useModal();
  const { yjsDocMap } = useCollaborationContext();
  const isCollab = yjsDocMap.get('main') !== undefined;
  const { t } = useTranslation(['action']);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerCommand<boolean>(
        CONNECTED_COMMAND,
        (payload) => {
          const isConnected = payload;
          setConnected(isConnected);
          return false;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
          setIsEditorEmpty(false);
        } else {
          if ($isParagraphNode(children[0])) {
            const paragraphChildren = children[0].getChildren();
            setIsEditorEmpty(paragraphChildren.length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        }
      });
    });
  }, [editor]);

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          PLAYGROUND_TRANSFORMERS
        );
      } else {
        const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
        root
          .clear()
          .append(
            $createCodeNode('markdown').append($createTextNode(markdown))
          );
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <div className="actions">
      {SUPPORT_SPEECH_RECOGNITION && (
        <button
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
          }}
          className={
            'action-button action-button-mic ' +
            (isSpeechToText ? 'active' : '')
          }
          title={t('action:Speech_To_Text')}
          aria-label={`${
            isSpeechToText ? t('action:Enable') : t('action:Disable')
          } ${t('action:speech_To_Text')}`}
          type="button"
        >
          <i className="mic" />
        </button>
      )}
      <button
        className="action-button import"
        onClick={() => importFile(editor)}
        title={t('action:Import')}
        aria-label={t('action:Import_Description')}
        type="button"
      >
        <i className="import" />
      </button>
      <button
        className="action-button export"
        onClick={() =>
          exportFile(editor, {
            fileName: `Playground ${new Date().toISOString()}`,
            source: 'Playground',
          })
        }
        title={t('action:Export')}
        aria-label={t('action:Export_Description')}
        type="button"
      >
        <i className="export" />
      </button>
      <button
        className="action-button clear"
        disabled={isEditorEmpty}
        onClick={() => {
          showModal(t('action:Clear_Editor'), (onClose) => (
            <ShowClearDialog editor={editor} onClose={onClose} t={t} />
          ));
        }}
        title={t('action:Clear')}
        aria-label={t('action:Clear_Description')}
        type="button"
      >
        <i className="clear" />
      </button>
      <button
        className={`action-button ${isEditable ? 'unlock' : 'lock'}`}
        onClick={() => {
          editor.setEditable(!editor.isEditable());
        }}
        title={t('action:Read-Only_Mode')}
        aria-label={`${isEditable ? t('action:Unlock') : t('action:Lock')} ${t(
          'action:Read-Only_Mode'
        )}`}
        type="button"
      >
        <i className={isEditable ? 'unlock' : 'lock'} />
      </button>
      <button
        className="action-button"
        onClick={handleMarkdownToggle}
        title={t('action:Convert_From_Markdown')}
        aria-label={t('action:Convert_From_Markdown_Description')}
        type="button"
      >
        <i className="markdown" />
      </button>
      {isCollab && (
        <button
          className="action-button connect"
          onClick={() => {
            editor.dispatchCommand(TOGGLE_CONNECT_COMMAND, !connected);
          }}
          title={`${
            connected ? t('action:Disconnect') : t('action:Connect')
          } ${t('action:Collaborative')}`}
          aria-label={`${
            connected ? t('action:Disconnect_From') : t('action:Connect_To')
          } ${t('action:Server')}`}
          type="button"
        >
          <i
            className={connected ? t('action:disconnect') : t('action:connect')}
          />
        </button>
      )}
      {modal}
    </div>
  );
}

function ShowClearDialog({
  editor,
  onClose,
  t,
}: {
  editor: LexicalEditor;
  onClose: () => void;
  t: TFunction;
}): JSX.Element {
  return (
    <>
      {t('action:Confirm_Clear')}
      <div className="Modal__content">
        <Button
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            editor.focus();
            onClose();
          }}
        >
          {t('action:Clear')}
        </Button>{' '}
        <Button
          onClick={() => {
            editor.focus();
            onClose();
          }}
        >
          {t('action:Cancel')}
        </Button>
      </div>
    </>
  );
}
