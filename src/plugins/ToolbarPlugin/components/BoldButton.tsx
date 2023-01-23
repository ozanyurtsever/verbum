import { FORMAT_TEXT_COMMAND } from 'lexical';
import React from 'react';
import { useContext } from 'react';
import { IS_APPLE } from '../../../shared/src/environment';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';
import { useTranslation } from 'react-i18next';

const BoldButton = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isBold } = useContext(ToolbarContext);
  const { t } = useTranslation('toolbar');

  return (
    <button
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
      title={
        IS_APPLE
          ? `${t('toolbar:boldButton.Title')} (⌘B)`
          : `${t('toolbar:boldButton.Title')} (Ctrl + B)`
      }
      aria-label={`${t('toolbar:boldButton.Description')} ${
        IS_APPLE ? '⌘B' : 'Ctrl+B'
      }`}
      type="button"
    >
      <i className="format bold" />
    </button>
  );
};

export default BoldButton;
