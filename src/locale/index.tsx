import * as i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ALIGN_DROPDOWN_EN from './en/AlignDropdown.json';
import ALIGN_DROPDOWN_FR from './fr/AlignDropdown.json';
import BACKGROUND_COLOR_PICKER_EN from './en/BackgroundColorPicker.json';
import BACKGROUND_COLOR_PICKER_FR from './fr/BackgroundColorPicker.json';
import BLOCK_FORMAT_DROPDOWN_EN from './en/BlockFormatDropdown.json';
import BLOCK_FORMAT_DROPDOWN_FR from './fr/BlockFormatDropdown.json';
import BOLD_BUTTON_EN from './en/BoldButton.json';
import BOLD_BUTTON_FR from './fr/BoldButton.json';
import CODE_FORMAT_BUTTON_EN from './en/CodeFormatButton.json';
import CODE_FORMAT_BUTTON_FR from './fr/CodeFormatButton.json';
import INSERT_LINK_BUTTON_EN from './en/InsertLinkButton.json';
import INSERT_LINK_BUTTON_FR from './fr/InsertLinkButton.json';
import ITALIC_BUTTON_EN from './en/ItalicButton.json';
import ITALIC_BUTTON_FR from './fr/ItalicButton.json';
import REDO_BUTTON_EN from './en/RedoButton.json';
import REDO_BUTTON_FR from './fr/RedoButton.json';
import UNDO_BUTTON_EN from './en/UndoButton.json';
import UNDO_BUTTON_FR from './fr/UndoButton.json';
import UNDERLINE_BUTTON_EN from './en/UnderlineButton.json';
import UNDERLINE_BUTTON_FR from './fr/UnderlineButton.json';
import TEXT_COLOR_PICKER_EN from './en/TextColorPicker.json';
import TEXT_COLOR_PICKER_FR from './fr/TextColorPicker.json';
import TEXT_FORMAT_DROPDOWN_EN from './en/TextFormatDropdown.json';
import TEXT_FORMAT_DROPDOWN_FR from './fr/TextFormatDropdown.json';
import INSERT_DROPDOWN_EN from './en/InsertDropdown.json';
import INSERT_DROPDOWN_FR from './fr/InsertDropdown.json';
import MENTIONS_PLUGIN_EN from './en/MentionsPlugin.json';
import MENTIONS_PLUGIN_FR from './fr/MentionsPlugin.json';
import ACTION_BUTTON_EN from './en/ActionButton.json';
import ACTION_BUTTON_FR from './fr/ActionButton.json';
import CHARACTER_STYLES_POPUP_PLUGIN_EN from './en/CharacterStylesPopupPlugin.json';
import CHARACTER_STYLES_POPUP_PLUGIN_FR from './fr/CharacterStylesPopupPlugin.json';
import COMMENT_PLUGIN_EN from './en/CommentPlugin.json';
import COMMENT_PLUGIN_FR from './fr/CommentPlugin.json';
import TEST_RECORDER_PLUGIN_EN from './en/TestRecorderPlugin.json';
import TEST_RECORDER_PLUGIN_FR from './fr/TestRecorderPlugin.json';
import TABLE_ACTION_MENU_PLUGIN_EN from './en/TableActionMenuPlugin.json';
import TABLE_ACTION_MENU_PLUGIN_FR from './fr/TableActionMenuPlugin.json';

export const resources = {
  ar: {},
  de: {},
  en: {
    toolbar: {
      alignDropdown: ALIGN_DROPDOWN_EN,
      backgroundColorPicker: BACKGROUND_COLOR_PICKER_EN,
      blockFormatDropdown: BLOCK_FORMAT_DROPDOWN_EN,
      boldButton: BOLD_BUTTON_EN,
      codeFormatButton: CODE_FORMAT_BUTTON_EN,
      insertLinkButton: INSERT_LINK_BUTTON_EN,
      italicButton: ITALIC_BUTTON_EN,
      redoButton: REDO_BUTTON_EN,
      underlineButton: UNDERLINE_BUTTON_EN,
      undoButton: UNDO_BUTTON_EN,
      textColorPicker: TEXT_COLOR_PICKER_EN,
      textFormatDropdown: TEXT_FORMAT_DROPDOWN_EN,
      insertDropdown: INSERT_DROPDOWN_EN,
      mentionsPlugin: MENTIONS_PLUGIN_EN,
      characterStylesPopupPlugin: CHARACTER_STYLES_POPUP_PLUGIN_EN,
      commentPlugin: COMMENT_PLUGIN_EN,
      testRecorderPlugin: TEST_RECORDER_PLUGIN_EN,
      tableActionMenuPlugin: TABLE_ACTION_MENU_PLUGIN_EN,
    },
    action: ACTION_BUTTON_EN,
  },
  es: {},
  fr: {
    toolbar: {
      alignDropdown: ALIGN_DROPDOWN_FR,
      backgroundColorPicker: BACKGROUND_COLOR_PICKER_FR,
      blockFormatDropdown: BLOCK_FORMAT_DROPDOWN_FR,
      boldButton: BOLD_BUTTON_FR,
      codeFormatButton: CODE_FORMAT_BUTTON_FR,
      insertLinkButton: INSERT_LINK_BUTTON_FR,
      italicButton: ITALIC_BUTTON_FR,
      redoButton: REDO_BUTTON_FR,
      underlineButton: UNDERLINE_BUTTON_FR,
      undoButton: UNDO_BUTTON_FR,
      textColorPicker: TEXT_COLOR_PICKER_FR,
      textFormatDropdown: TEXT_FORMAT_DROPDOWN_FR,
      insertDropdown: INSERT_DROPDOWN_FR,
      mentionsPlugin: MENTIONS_PLUGIN_FR,
      characterStylesPopupPlugin: CHARACTER_STYLES_POPUP_PLUGIN_FR,
      commentPlugin: COMMENT_PLUGIN_FR,
      testRecorderPlugin: TEST_RECORDER_PLUGIN_FR,
      tableActionMenuPlugin: TABLE_ACTION_MENU_PLUGIN_FR,
    },
    action: ACTION_BUTTON_FR,
  },
  it: {},
  ja: {},
  nl: {},
  pl: {},
  pt: {},
  ru: {},
  ukr: {},
  zh: {},
} as const;

export const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    const language = navigator.language;
    callback(language.substring(0, 2));
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

export const i18n = i18next
  .use(initReactI18next)
  .use(languageDetector as i18next.Module)
  .init({
    ns: ['toolbar', 'action'],
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
