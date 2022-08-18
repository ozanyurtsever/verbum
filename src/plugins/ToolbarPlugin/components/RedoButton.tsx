import * as React from 'react';
import { useContext } from 'react';
import ToolbarContext from '../../../context/ToolbarContext';
import { REDO_COMMAND } from 'lexical';
import EditorContext from '../../../context/EditorContext';
import { IS_APPLE } from '../../../shared/src/environment';

const RedoButton = () => {
  const { canRedo } = useContext(ToolbarContext);
  const { activeEditor } = useContext(EditorContext);
  return (
    <button
      disabled={!canRedo}
      onClick={() => {
        activeEditor.dispatchCommand(REDO_COMMAND, undefined);
      }}
      title={IS_APPLE ? 'Redo (⌘Y)' : 'Undo (Ctrl+Y)'}
      className="toolbar-item"
      aria-label="Redo"
      type="button"
    >
      <i className="format redo" />
    </button>
  );
};

export default RedoButton;
