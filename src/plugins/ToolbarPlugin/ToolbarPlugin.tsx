/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $wrapLeafNodesInElements,
} from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useChild from 'use-child';
import { getSelectedNode } from '../../utils/node.util';
import EditorContext from '../../context/EditorContext';
import ToolbarContext from '../../context/ToolbarContext';
import { IS_APPLE } from '../../shared/src/environment';
import DropDown from '../../ui/DropDown';
import AlignDropdown from './components/AlignDropdown';
import BoldButton from './components/BoldButton';
import CodeFormatButton from './components/CodeFormatButton';
import FontFamilyDropdown from './components/FontFamilyDropdown';
import FontSizeDropdown from './components/FontSizeDropdown';
import InsertDropdown from './components/InsertDropdown';
import ItalicButton from './components/ItalicButton';
import UnderlineButton from './components/UnderlineButton';
import './ToolbarPlugin.css';
import InsertLinkButton from './components/InsertLinkButton';
import TextColorPicker from './components/TextColorPicker';
import BackgroundColorPicker from './components/BackgroundColorPicker';
import TextFormatDropdown from './components/TextFormatDropdown';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';
import CodeLanguageDropdown from './components/CodeLanguageDropdown';

const supportedBlockTypes = new Set([
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'h3',
  'bullet',
  'number',
  'check',
]);

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

const CODE_LANGUAGE_MAP = {
  javascript: 'js',
  md: 'markdown',
  plaintext: 'plain',
  python: 'py',
  text: 'plain',
};

function BlockFormatDropDown({
  editor,
  blockType,
}: {
  blockType: string;
  editor: LexicalEditor;
}): JSX.Element {
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () =>
            $createHeadingNode(headingSize)
          );
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $wrapLeafNodesInElements(selection, () => $createCodeNode());
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
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={'icon block-type ' + blockType}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <button className="item" onClick={formatParagraph}>
        <span className="icon paragraph" />
        <span className="text">Normal</span>
        {blockType === 'paragraph' && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading('h1')}>
        <span className="icon h1" />
        <span className="text">Heading 1</span>
        {blockType === 'h1' && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading('h2')}>
        <span className="icon h2" />
        <span className="text">Heading 2</span>
        {blockType === 'h2' && <span className="active" />}
      </button>
      <button className="item" onClick={() => formatHeading('h3')}>
        <span className="icon h3" />
        <span className="text">Heading 3</span>
        {blockType === 'h3' && <span className="active" />}
      </button>
      <button className="item" onClick={formatBulletList}>
        <span className="icon bullet-list" />
        <span className="text">Bullet List</span>
        {blockType === 'bullet' && <span className="active" />}
      </button>
      <button className="item" onClick={formatNumberedList}>
        <span className="icon numbered-list" />
        <span className="text">Numbered List</span>
        {blockType === 'number' && <span className="active" />}
      </button>
      <button className="item" onClick={formatCheckList}>
        <span className="icon check-list" />
        <span className="text">Check List</span>
        {blockType === 'check' && <span className="active" />}
      </button>
      <button className="item" onClick={formatQuote}>
        <span className="icon quote" />
        <span className="text">Quote</span>
        {blockType === 'quote' && <span className="active" />}
      </button>
      <button className="item" onClick={formatCode}>
        <span className="icon code" />
        <span className="text">Code Block</span>
        {blockType === 'code' && <span className="active" />}
      </button>
    </DropDown>
  );
}

function Divider(): JSX.Element {
  return <div className="divider" />;
}

function Select({
  onChange,
  className,
  options,
  value,
}: {
  className: string;
  onChange: (event: { target: { value: string } }) => void;
  options: [string, string][];
  value: string;
}): JSX.Element {
  return (
    <select className={className} onChange={onChange} value={value}>
      {options.map(([option, text]) => (
        <option key={option} value={option}>
          {text}
        </option>
      ))}
    </select>
  );
}

interface IToolbarProps {
  children?: React.ReactElement | React.ReactElement[];
  defaultFontSize?: string /** The default selected font size in the toolbar */;
  defaultFontColor?: string /** The default selected font color in the toolbar */;
  defaultBgColor?: string /** The default selected background color in the toolbar */;
  defaultFontFamily?: string /** The default selected font family in the toolbar */;
}

const ToolbarPlugin = ({
  children,
  defaultFontSize = '15px',
  defaultFontColor = '#000',
  defaultBgColor = '#fff',
  defaultFontFamily = 'Arial',
}: IToolbarProps) => {
  const [insertExists, InsertComponent] = useChild(children, InsertDropdown);
  const [alignExists, AlignComponent] = useChild(children, AlignDropdown);

  const { initialEditor, activeEditor, setActiveEditor } =
    useContext(EditorContext);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [fontSize, setFontSize] = useState<string>(defaultFontSize);
  const [fontColor, setFontColor] = useState<string>(defaultFontColor);
  const [bgColor, setBgColor] = useState<string>(defaultBgColor);
  const [fontFamily, setFontFamily] = useState<string>(defaultFontFamily);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            const language = element.getLanguage();
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ''
            );
            return;
          }
        }
      }
      // Hande buttons
      setFontSize(
        $getSelectionStyleValueForProperty(
          selection,
          'font-size',
          defaultFontSize
        )
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', defaultFontColor)
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          defaultBgColor
        )
      );

      setFontFamily(
        $getSelectionStyleValueForProperty(
          selection,
          'font-family',
          defaultFontFamily
        )
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return initialEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [initialEditor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      initialEditor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      initialEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [initialEditor, isLink]);

  return (
    <ToolbarContext.Provider
      value={{
        isRTL,
        canUndo,
        canRedo,
        fontFamily,
        fontSize,
        fontColor,
        bgColor,
        isBold,
        isItalic,
        isUnderline,
        isCode,
        isLink,
        applyStyleText,
        insertLink,
        isStrikethrough,
        isSubscript,
        isSuperscript,
        selectedElementKey,
        codeLanguage,
      }}
    >
      <div className="toolbar">
        <UndoButton />
        <RedoButton />
        <Divider />
        {supportedBlockTypes.has(blockType) && activeEditor === initialEditor && (
          <>
            <BlockFormatDropDown blockType={blockType} editor={initialEditor} />
            <Divider />
          </>
        )}
        {blockType === 'code' ? (
          <CodeLanguageDropdown />
        ) : (
          <>
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
            {insertExists && InsertComponent}
          </>
        )}
        <Divider />
        {alignExists && AlignComponent}
      </div>
    </ToolbarContext.Provider>
  );
};

export default ToolbarPlugin;
