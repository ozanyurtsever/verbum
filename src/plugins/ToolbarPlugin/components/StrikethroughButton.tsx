import React, { useState } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const StrikethroughButton = () => {
	const { activeEditor } = useContext(EditorContext);
	const { isStrikethrough } = useContext(ToolbarContext);
	const { t } = useTranslation('toolbar');

	return (
		<button
			onClick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
			}}
			className={
				'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')
			}
			title={t('toolbar:textFormatDropdown.Options.Strikethrough.Label')}
			aria-label={t(
				'toolbar:textFormatDropdown.Options.Strikethrough.Description'
			)}
			type="button"
		>
			<i className="format strikethrough" />
		</button>
	);
};

export default StrikethroughButton;