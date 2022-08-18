import { FORMAT_TEXT_COMMAND } from 'lexical';
import React from 'react';
import { useContext } from 'react';
import { IS_APPLE } from '../../../shared/src/environment';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const UnderlineButton = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isUnderline } = useContext(ToolbarContext);

  return (
    <button
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }}
      className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
      title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
      aria-label={`Format text to underlined. Shortcut: ${
        IS_APPLE ? '⌘U' : 'Ctrl+U'
      }`}
      type="button"
    >
      <i className="format underline" />
    </button>
  );
};

export default UnderlineButton;
