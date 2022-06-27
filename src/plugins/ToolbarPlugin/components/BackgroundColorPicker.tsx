import React, { useCallback, useContext } from 'react';
import ToolbarContext from '../../../context/ToolbarContext';
import ColorPicker from '../../../ui/ColorPicker';

const BackgroundColorPicker = () => {
  const { bgColor, applyStyleText } = useContext(ToolbarContext);

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ 'background-color': value });
    },
    [applyStyleText]
  );

  return (
    <ColorPicker
      buttonClassName="toolbar-item color-picker"
      buttonAriaLabel="Formatting background color"
      buttonIconClassName="icon bg-color"
      color={bgColor}
      onChange={onBgColorSelect}
      title="bg color"
    />
  );
};

export default BackgroundColorPicker;
