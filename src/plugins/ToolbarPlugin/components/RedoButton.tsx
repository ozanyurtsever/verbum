import * as React from 'react';
import { useContext } from 'react';
import ToolbarContext from '../../../context/ToolbarContext';
import { REDO_COMMAND } from 'lexical';
import EditorContext from '../../../context/EditorContext';
import { IS_APPLE } from '../../../shared/src/environment';
import { useTranslation } from 'react-i18next';

const RedoButton = () => {
  const { canRedo } = useContext(ToolbarContext);
  const { activeEditor } = useContext(EditorContext);
  const { t } = useTranslation('toolbar');
  return (
    <button
      disabled={!canRedo}
      onClick={() => {
        activeEditor.dispatchCommand(REDO_COMMAND, undefined);
      }}
      title={
        IS_APPLE
          ? `${t('toolbar:redoButton.Title')} (⌘Y)`
          : `${t('toolbar:redoButton.Title')} (Ctrl+Y)`
      }
      className="toolbar-item"
      aria-label={t('toolbar:redoButton.Description')}
      type="button"
    >
      <i className="format redo" />
    </button>
  );
};

export default RedoButton;
