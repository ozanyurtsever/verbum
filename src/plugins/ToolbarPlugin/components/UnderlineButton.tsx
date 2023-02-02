import { FORMAT_TEXT_COMMAND } from 'lexical';
import React from 'react';
import { useContext } from 'react';
import { IS_APPLE } from '../../../shared/src/environment';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';
import { useTranslation } from 'react-i18next';

const UnderlineButton = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isUnderline } = useContext(ToolbarContext);
  const { t } = useTranslation('toolbar');

  return (
    <button
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }}
      className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
      title={
        IS_APPLE
          ? `${t('toolbar:underlineButton.Title')} (⌘U)`
          : `${t('toolbar:underlineButton.Title')} (Ctrl+U)`
      }
      aria-label={`${t('toolbar:underlineButton.Description')} ${
        IS_APPLE ? '⌘U' : 'Ctrl+U'
      }`}
      type="button"
    >
      <i className="format underline" />
    </button>
  );
};

export default UnderlineButton;
