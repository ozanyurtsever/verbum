import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $wrapNodes } from '@lexical/selection';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from 'lexical';
import React, { useContext } from 'react';
import EditorContext from '../../../context/EditorContext';
import DropDown from '../../../ui/DropDown';
import ToolbarContext from '../../../context/ToolbarContext';
import { useTranslation } from 'react-i18next';

const BlockFormatDropdown = () => {
  const { initialEditor } = useContext(EditorContext);
  const { blockType } = useContext(ToolbarContext);
  const { t } = useTranslation('toolbar');
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      initialEditor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      initialEditor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      initialEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      initialEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      initialEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      initialEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      initialEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      initialEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      initialEditor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      initialEditor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $wrapNodes(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.removeText();
            selection.insertNodes([codeNode]);
            selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      buttonLabel={t(`blockFormatDropdown.${blockType}`)}
      buttonAriaLabel={t('toolbar:blockFormatDropdown.Description')}
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={'icon block-type ' + blockType}
    >
      <button className="item" onClick={formatParagraph} type="button">
        <span className="icon paragraph" />
        <span className="text">{t('toolbar:blockFormatDropdown.paragraph')}</span>
        {blockType === 'paragraph' && <span className="active" />}
      </button>
      <button
        className="item"
        onClick={() => formatHeading('h1')}
        type="button"
      >
        <span className="icon h1" />
        <span className="text">
          {t('toolbar:blockFormatDropdown.h1')}
        </span>
        {blockType === 'h1' && <span className="active" />}
      </button>
      <button
        className="item"
        onClick={() => formatHeading('h2')}
        type="button"
      >
        <span className="icon h2" />
        <span className="text">
          {t('toolbar:blockFormatDropdown.h2')}
        </span>
        {blockType === 'h2' && <span className="active" />}
      </button>
      <button
        className="item"
        onClick={() => formatHeading('h3')}
        type="button"
      >
        <span className="icon h3" />
        <span className="text">
          {t('toolbar:blockFormatDropdown.h3')}
        </span>
        {blockType === 'h3' && <span className="active" />}
      </button>
      <button className="item" onClick={formatBulletList} type="button">
        <span className="icon bullet-list" />
        <span className="text">
          {t('toolbar:blockFormatDropdown.bullet')}
        </span>
        {blockType === 'bullet' && <span className="active" />}
      </button>
      <button className="item" onClick={formatNumberedList} type="button">
        <span className="icon numbered-list" />
        <span className="text">
          {t('toolbar:blockFormatDropdown.number')}
        </span>
        {blockType === 'number' && <span className="active" />}
      </button>
      <button className="item" onClick={formatCheckList} type="button">
        <span className="icon check-list" />
        <span className="text">
          {t('toolbar:blockFormatDropdown.check')}
        </span>
        {blockType === 'check' && <span className="active" />}
      </button>
      <button className="item" onClick={formatQuote} type="button">
        <span className="icon quote" />
        <span className="text">{t('toolbar:blockFormatDropdown.quote')}</span>
        {blockType === 'quote' && <span className="active" />}
      </button>
      <button className="item" onClick={formatCode} type="button">
        <span className="icon code" />
        <span className="text">
          {t('toolbar:blockFormatDropdown.code')}
        </span>
        {blockType === 'code' && <span className="active" />}
      </button>
    </DropDown>
  );
};

export default BlockFormatDropdown;
