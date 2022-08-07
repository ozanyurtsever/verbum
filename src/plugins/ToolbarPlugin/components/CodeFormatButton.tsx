import { FORMAT_TEXT_COMMAND } from 'lexical';
import React from 'react';
import { useContext } from 'react';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const CodeFormatButton = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isCode } = useContext(ToolbarContext);

  return (
    <button
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      }}
      className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
      title="Insert code block"
      aria-label="Insert code block"
      type="button"
    >
      <i className="format code" />
    </button>
  );
};

export default CodeFormatButton;
