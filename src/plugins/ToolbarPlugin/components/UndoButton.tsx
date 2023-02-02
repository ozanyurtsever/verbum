import * as React from 'react';
import { useContext } from 'react';
import ToolbarContext from '../../../context/ToolbarContext';
import { UNDO_COMMAND } from 'lexical';
import EditorContext from '../../../context/EditorContext';
import { IS_APPLE } from '../../../shared/src/environment';
import { useTranslation } from 'react-i18next';

const UndoButton = () => {
  const { canUndo } = useContext(ToolbarContext);
  const { activeEditor } = useContext(EditorContext);
  const { t } = useTranslation('toolbar');
  return (
    <button
      disabled={!canUndo}
      onClick={() => {
        activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
      }}
      title={
        IS_APPLE
          ? `${t('toolbar:undoButton.Title')} (⌘Z)`
          : `${t('toolbar:undoButton.Title')} (Ctrl+Z)`
      }
      className="toolbar-item spaced"
      aria-label={t('toolbar:undoButton.Description')}
      type="button"
    >
      <i className="format undo" />
    </button>
  );
};

export default UndoButton;
