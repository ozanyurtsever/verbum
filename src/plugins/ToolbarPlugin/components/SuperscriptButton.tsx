import React, { useState } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const SuperscriptButton = () => {
	const { activeEditor } = useContext(EditorContext);
	const { isSuperscript } = useContext(ToolbarContext);
	const { t } = useTranslation('toolbar');

	return (
		<button
			onClick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
			}}
			className={
				'toolbar-item spaced ' + (isSuperscript ? 'active' : '')
			}
			title={t('toolbar:textFormatDropdown.Options.Superscript.Label')}
			aria-label={t(
				'toolbar:textFormatDropdown.Options.Superscript.Description'
			)}
			type="button"
		>
			<i className="format superscript" />
		</button>
	);
};

export default SuperscriptButton;