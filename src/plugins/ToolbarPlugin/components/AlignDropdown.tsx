import React from 'react';
import DropDown from '../../../ui/DropDown';

import {
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';

function Divider(): JSX.Element {
  return <div className="divider" />;
}

interface IAlignDropdown {
  activeEditor: LexicalEditor;
  isRTL: boolean;
}

const AlignDropdown = ({ activeEditor, isRTL }: IAlignDropdown) => {
  return (
    <DropDown
      buttonLabel="Align"
      buttonIconClassName="icon left-align"
      buttonClassName="toolbar-item spaced alignment"
      buttonAriaLabel="Formatting options for text alignment"
    >
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="item"
      >
        <i className="icon left-align" />
        <span className="text">Left Align</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="item"
      >
        <i className="icon center-align" />
        <span className="text">Center Align</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="item"
      >
        <i className="icon right-align" />
        <span className="text">Right Align</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="item"
      >
        <i className="icon justify-align" />
        <span className="text">Justify Align</span>
      </button>
      <Divider />
      <button
        onClick={() => {
          activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        className="item"
      >
        <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
        <span className="text">Outdent</span>
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        className="item"
      >
        <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
        <span className="text">Indent</span>
      </button>
    </DropDown>
  );
};

export default AlignDropdown;
