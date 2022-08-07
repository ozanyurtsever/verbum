import { FORMAT_TEXT_COMMAND } from 'lexical';
import React from 'react';
import { useContext } from 'react';
import { IS_APPLE } from '../../../shared/src/environment';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const BoldButton = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isBold } = useContext(ToolbarContext);

  return (
    <button
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
      title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
      aria-label={`Format text as bold. Shortcut: ${
        IS_APPLE ? '⌘B' : 'Ctrl+B'
      }`}
      type="button"
    >
      <i className="format bold" />
    </button>
  );
};

export default BoldButton;
