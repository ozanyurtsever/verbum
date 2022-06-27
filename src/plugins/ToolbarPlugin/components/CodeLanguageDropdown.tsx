import { $isCodeNode } from '@lexical/code';
import { $getNodeByKey } from 'lexical';
import React, { useCallback, useContext } from 'react';
import EditorContext from '../../../context/EditorContext';
import Select from '../../../ui/Select';
import ToolbarContext from '../../../context/ToolbarContext';

const CODE_LANGUAGE_OPTIONS: [string, string][] = [
  ['', '- Select language -'],
  ['c', 'C'],
  ['clike', 'C-like'],
  ['css', 'CSS'],
  ['html', 'HTML'],
  ['js', 'JavaScript'],
  ['markdown', 'Markdown'],
  ['objc', 'Objective-C'],
  ['plain', 'Plain Text'],
  ['py', 'Python'],
  ['rust', 'Rust'],
  ['sql', 'SQL'],
  ['swift', 'Swift'],
  ['xml', 'XML'],
];

const CodeLanguageDropdown = () => {
  const { activeEditor } = useContext(EditorContext);
  const { selectedElementKey, codeLanguage } = useContext(ToolbarContext);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            console.log(e.target.value);
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return (
    <>
      <Select
        className="toolbar-item code-language"
        onChange={onCodeLanguageSelect}
        options={CODE_LANGUAGE_OPTIONS}
        value={codeLanguage}
      />
      <i className="chevron-down inside" />
    </>
  );
};

export default CodeLanguageDropdown;
