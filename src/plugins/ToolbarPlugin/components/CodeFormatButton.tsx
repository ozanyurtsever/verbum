import { FORMAT_TEXT_COMMAND } from 'lexical';
import React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const CodeFormatButton = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isCode } = useContext(ToolbarContext);
  const { t } = useTranslation('toolbar');

  return (
    <button
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      }}
      className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
      title={t('toolbar:codeFormatButton.Description')}
      aria-label={t('toolbar:codeFormatButton.Description')}
      type="button"
    >
      <i className="format code" />
    </button>
  );
};

export default CodeFormatButton;
