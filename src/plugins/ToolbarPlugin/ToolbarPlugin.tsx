/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor, RangeSelection } from 'lexical';

import './ToolbarPlugin.css';

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
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $isParentElementRTL,
  $patchStyleText,
  $wrapLeafNodesInElements,
} from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
} from 'lexical';
import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IS_APPLE } from '../../shared/src/environment';

import useModal from '../../hooks/useModal';
// import catTypingGif from "../images/cat-typing.gif";
// import yellowFlowerImage from "../images/yellow-flower.jpg";
import ColorPicker from '../../ui/ColorPicker';
import DropDown from '../../ui/DropDown';
import LinkPreview from '../../ui/LinkPreview';

import InsertDropdown from './components/InsertDropdown';
import AlignDropdown from './components/AlignDropdown';
import useChild from 'use-child';
import EditorContext from '../../context/EditorContext';
import ToolbarContext from '../../context/ToolbarContext';

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

const CODE_LANGUAGE_OPTIONS: [string, string][] = [
  ['', '- Select language -'],
  ['c', 'C'],
  ['clike', 'C-like'],
  ['css', 'CSS'],
  ['html', 'HTML'],
  ['js', 'JavaScript'],
  ['markdown', 'Markdown'],
  ['objc', 'Objective-C'],
  ['plain', 'Plain Text'],
  ['py', 'Python'],
  ['rust', 'Rust'],
  ['sql', 'SQL'],
  ['swift', 'Swift'],
  ['xml', 'XML'],
];

const CODE_LANGUAGE_MAP = {
  javascript: 'js',
  md: 'markdown',
  plaintext: 'plain',
  python: 'py',
  text: 'plain',
};

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({
  editor,
}: {
  editor: LexicalEditor;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      positionEditorElement(editorElem, rect);
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [editor]);

  useEffect(() => {
    const onResize = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
          <LinkPreview url={linkUrl} />
        </>
      )}
    </div>
  );
}

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
  enableInsertDropdown?: boolean;
  enableAlignDropdown?: boolean;
  children?: React.ReactElement | React.ReactElement[];
  defaultFontSize?: string /** The default selected font size in the toolbar */;
  defaultFontColor?: string /** The default selected font color in the toolbar */;
  defaultBgColor?: string /** The default selected background color in the toolbar */;
  defaultFontFamily?: string /** The default selected font family in the toolbar */;
}

const ToolbarPlugin = ({
  enableInsertDropdown = true,
  enableAlignDropdown = true,
  children,
  defaultFontSize = '15px',
  defaultFontColor = '#000',
  defaultBgColor = '#fff',
  defaultFontFamily = 'Arial',
}: IToolbarProps) => {
  // const [initialEditor] = useLexicalComposerContext();
  const [insertExists, InsertComponent] = useChild(children, InsertDropdown);
  const [alignExists, AlignComponent] = useChild(children, AlignDropdown);

  // const [activeEditor, setActiveEditor] = useState(editor);
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

  const onFontSizeSelect = useCallback(
    (e) => {
      applyStyleText({ 'font-size': e.target.value });
    },
    [applyStyleText]
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ 'background-color': value });
    },
    [applyStyleText]
  );

  const onFontFamilySelect = useCallback(
    (e) => {
      applyStyleText({ 'font-family': e.target.value });
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      initialEditor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      initialEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [initialEditor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (e) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            console.log(e.target.value);
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return (
    <ToolbarContext.Provider value={{ isRTL, canUndo, canRedo }}>
      <div className="toolbar">
        <button
          disabled={!canUndo}
          onClick={() => {
            activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
          className="toolbar-item spaced"
          aria-label="Undo"
        >
          <i className="format undo" />
        </button>
        <button
          disabled={!canRedo}
          onClick={() => {
            activeEditor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          title={IS_APPLE ? 'Redo (⌘Y)' : 'Undo (Ctrl+Y)'}
          className="toolbar-item"
          aria-label="Redo"
        >
          <i className="format redo" />
        </button>
        <Divider />
        {supportedBlockTypes.has(blockType) && activeEditor === initialEditor && (
          <>
            <BlockFormatDropDown blockType={blockType} editor={initialEditor} />
            <Divider />
          </>
        )}
        {blockType === 'code' ? (
          <>
            <Select
              className="toolbar-item code-language"
              onChange={onCodeLanguageSelect}
              options={CODE_LANGUAGE_OPTIONS}
              value={codeLanguage}
            />
            <i className="chevron-down inside" />
          </>
        ) : (
          <>
            <>
              <Select
                className="toolbar-item font-family"
                onChange={onFontFamilySelect}
                options={[
                  ['Arial', 'Arial'],
                  ['Courier New', 'Courier New'],
                  ['Georgia', 'Georgia'],
                  ['Times New Roman', 'Times New Roman'],
                  ['Trebuchet MS', 'Trebuchet MS'],
                  ['Verdana', 'Verdana'],
                ]}
                value={fontFamily}
              />
              <i className="chevron-down inside" />
            </>
            <>
              <Select
                className="toolbar-item font-size"
                onChange={onFontSizeSelect}
                options={[
                  ['10px', '10px'],
                  ['11px', '11px'],
                  ['12px', '12px'],
                  ['13px', '13px'],
                  ['14px', '14px'],
                  ['15px', '15px'],
                  ['16px', '16px'],
                  ['17px', '17px'],
                  ['18px', '18px'],
                  ['19px', '19px'],
                  ['20px', '20px'],
                ]}
                value={fontSize}
              />
              <i className="chevron-down inside" />
            </>
            <Divider />
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
              title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
              aria-label={`Format text as bold. Shortcut: ${
                IS_APPLE ? '⌘B' : 'Ctrl+B'
              }`}
            >
              <i className="format bold" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
              title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
              aria-label={`Format text as italics. Shortcut: ${
                IS_APPLE ? '⌘I' : 'Ctrl+I'
              }`}
            >
              <i className="format italic" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
              title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
              aria-label={`Format text to underlined. Shortcut: ${
                IS_APPLE ? '⌘U' : 'Ctrl+U'
              }`}
            >
              <i className="format underline" />
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
              className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
              title="Insert code block"
              aria-label="Insert code block"
            >
              <i className="format code" />
            </button>
            <button
              onClick={insertLink}
              className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
              aria-label="Insert link"
              title="Insert link"
            >
              <i className="format link" />
            </button>
            {isLink &&
              createPortal(
                <FloatingLinkEditor editor={activeEditor} />,
                document.body
              )}
            <ColorPicker
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting text color"
              buttonIconClassName="icon font-color"
              color={fontColor}
              onChange={onFontColorSelect}
              title="text color"
            />
            <ColorPicker
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting background color"
              buttonIconClassName="icon bg-color"
              color={bgColor}
              onChange={onBgColorSelect}
              title="bg color"
            />
            <DropDown
              buttonClassName="toolbar-item spaced"
              buttonLabel=""
              buttonAriaLabel="Formatting options for additional text styles"
              buttonIconClassName="icon dropdown-more"
            >
              <button
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'strikethrough'
                  );
                }}
                className={
                  'item ' +
                  (isStrikethrough ? 'active dropdown-item-active' : '')
                }
                title="Strikethrough"
                aria-label="Format text with a strikethrough"
              >
                <i className="icon strikethrough" />
                <span className="text">Strikethrough</span>
              </button>
              <button
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'subscript'
                  );
                }}
                className={
                  'item ' + (isSubscript ? 'active dropdown-item-active' : '')
                }
                title="Subscript"
                aria-label="Format text with a subscript"
              >
                <i className="icon subscript" />
                <span className="text">Subscript</span>
              </button>
              <button
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'superscript'
                  );
                }}
                className={
                  'item ' + (isSuperscript ? 'active dropdown-item-active' : '')
                }
                title="Superscript"
                aria-label="Format text with a superscript"
              >
                <i className="icon superscript" />
                <span className="text">Superscript</span>
              </button>
            </DropDown>
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
