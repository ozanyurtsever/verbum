import React, { useState } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import EditorContext from '../../../context/EditorContext';
import ToolbarContext from '../../../context/ToolbarContext';

const SubscriptButton = () => {
	const { activeEditor } = useContext(EditorContext);
	const { isSubscript } = useContext(ToolbarContext);
	const { t } = useTranslation('toolbar');

	return (
		<button
			onClick={() => {
				activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
			}}
			className={
				'toolbar-item spaced ' + (isSubscript ? 'active' : '')
			}
			title={t('toolbar:textFormatDropdown.Options.Subscript.Label')}
			aria-label={t(
				'toolbar:textFormatDropdown.Options.Subscript.Description'
			)}
			type="button"
		>
			<i className="format subscript" />
		</button>
	);
};

export default SubscriptButton;