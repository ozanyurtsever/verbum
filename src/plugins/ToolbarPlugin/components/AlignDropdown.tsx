import React, { useContext } from 'react';
import DropDown from '../../../ui/DropDown';

import {
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';
import { useTranslation } from 'react-i18next';

function Divider(): JSX.Element {
  return <div className="divider" />;
}

const AlignDropdown = () => {
  const { activeEditor } = useContext(EditorContext);
  const { isRTL } = useContext(ToolbarContext);
  const { t } = useTranslation('toolbar');
  return (
    <DropDown
      buttonLabel={t('toolbar:alignDropdown.Title')}
      buttonAriaLabel={t('toolbar:alignDropdown.Description')}
      buttonClassName="toolbar-item spaced alignment"
      buttonIconClassName="icon left-align"
    >
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="item"
        type="button"
      >
        <i className="icon left-align" />
        <span className="text">{t('toolbar:alignDropdown.LeftAlign')}</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="item"
        type="button"
      >
        <i className="icon center-align" />
        <span className="text">{t('toolbar:alignDropdown.CenterAlign')}</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="item"
        type="button"
      >
        <i className="icon right-align" />
        <span className="text">{t('toolbar:alignDropdown.RightAlign')}</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="item"
        type="button"
      >
        <i className="icon justify-align" />
        <span className="text">{t('toolbar:alignDropdown.JustifyAlign')}</span>
      </button>
      <Divider />
      <button
        onClick={() => {
          activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        className="item"
        type="button"
      >
        <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
        <span className="text">{t('toolbar:alignDropdown.Outdent')}</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        className="item"
        type="button"
      >
        <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
        <span className="text">{t('toolbar:alignDropdown.Indent')}</span>
      </button>
    </DropDown>
  );
};

export default AlignDropdown;
