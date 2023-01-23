import { FORMAT_TEXT_COMMAND } from 'lexical';
import React from 'react';
import { useContext } from 'react';
import { IS_APPLE } from '../../../shared/src/environment';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';
import { useTranslation } from 'react-i18next';

const ItalicButton = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isItalic } = useContext(ToolbarContext);
  const { t } = useTranslation('toolbar');

  return (
    <button
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }}
      className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
      title={
        IS_APPLE
          ? `${t('toolbar:italicButton.Title')} (⌘I)`
          : `${t('toolbar:italicButton.Title')} (Ctrl+I)`
      }
      aria-label={`${t('toolbar:italicButton.Description')} ${
        IS_APPLE ? '⌘I' : 'Ctrl+I'
      }`}
      type="button"
    >
      <i className="format italic" />
    </button>
  );
};

export default ItalicButton;
