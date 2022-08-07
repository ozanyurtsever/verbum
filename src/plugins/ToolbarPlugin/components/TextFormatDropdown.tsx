import { FORMAT_TEXT_COMMAND } from 'lexical';
import React, { useContext } from 'react';
import DropDown from '../../../ui/DropDown';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const TextFormatDropdown = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isStrikethrough, isSubscript, isSuperscript } =
    useContext(ToolbarContext);
  return (
    <DropDown
      buttonClassName="toolbar-item spaced"
      buttonLabel=""
      buttonAriaLabel="Formatting options for additional text styles"
      buttonIconClassName="icon dropdown-more"
    >
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={
          'item ' + (isStrikethrough ? 'active dropdown-item-active' : '')
        }
        title="Strikethrough"
        aria-label="Format text with a strikethrough"
        type="button"
      >
        <i className="icon strikethrough" />
        <span className="text">Strikethrough</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        className={'item ' + (isSubscript ? 'active dropdown-item-active' : '')}
        title="Subscript"
        aria-label="Format text with a subscript"
        type="button"
      >
        <i className="icon subscript" />
        <span className="text">Subscript</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        className={
          'item ' + (isSuperscript ? 'active dropdown-item-active' : '')
        }
        title="Superscript"
        aria-label="Format text with a superscript"
        type="button"
      >
        <i className="icon superscript" />
        <span className="text">Superscript</span>
      </button>
    </DropDown>
  );
};

export default TextFormatDropdown;
