# Verbum

Verbum - Flexible Text Editor for React

**Verbum** is a fully flexible rich text editor based on [`lexical-playground`](https://github.com/facebook/lexical/tree/main/packages/lexical-playground) and [`lexical`](https://github.com/facebook/lexical) framework.

**⚠️ As the Lexical framework is currently in early development, this component library is also likely to change quite often**

## Installation

```
npm install verbum --save
```

## Demo

![Demo](verbum-demo.gif)
Live demo is coming soon...

## Usage

```js
import { FC } from 'react';
import {
  EditorComposer,
  Editor,
  ToolbarPlugin,
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  FloatingLinkEditor,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
  Divider,
} from 'verbum';

const NoteViewer: FC = () => {
  return (
    <EditorComposer>
      <Editor hashtagsEnabled={true}>
        <ToolbarPlugin defaultFontSize="20px">
          <FontFamilyDropdown />
          <FontSizeDropdown />
          <Divider />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <Divider />
          <InsertDropdown enablePoll={true} />
          <Divider />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>
    </EditorComposer>
  );
};

export default NoteViewer;
```

<!-- ## Examples

Coming soon... -->

<!--
## Styling components

Coming soon... -->

## API

`<EditorComposer />`

| Property           | Type                     |          | description                                       |
| ------------------ | ------------------------ | -------- | ------------------------------------------------- |
| children           | `ReactNode`              | required | Nested child component which is the Editor itself |
| initialEditorState | `InitialEditorStateType` | optional | The initial state of the editor                   |

<br />

`<Editor />`

| Property           | Type                                                            |          | description                                                                                                               |
| ------------------ | --------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| children           | `ReactNode`                                                     | optional | Nested child components, like the `ToolbarPlugin`                                                                         |
| hashtagsEnabled    | `boolean`                                                       | optional | Enables the automatic hashtag highlighting, default is `false`                                                            |
| autoLinkEnabled    | `boolean`                                                       | optional | Enables the automatic link highlighting, default is `false`                                                               |
| emojisEnabled      | `boolean`                                                       | optional | Replaces the emoji combiniations with its corresponding symbol, default is `false`                                        |
| actionsEnabled     | `boolean`                                                       | optional | Enables the actions toolbar, default is `false`                                                                           |
| placeholder        | `string`                                                        | optional | The default content of the editor when it is first loaded                                                                 |
| listMaxIndent      | `number`                                                        | optional | The maximum indent capacity of any listed element, the default is `7`                                                     |
| isEditable         | `boolean`                                                       | optional | Enables read-only mode for the editor, default is `false`                                                                 |
| initialEditorState | `string`                                                        | optional | JSON string to initialize the initial content of the editor.                                                              |
| onChange           | `(editorState: string, editorInstance?: LexicalEditor) => void` | optional | Accessing the current editor state and the active editor instance                                                         |
| locale             | `'en', 'fr', 'ptBr', 'ru', null;`                               | optional | Enables localization in the language of your choice, default is `en`. Available languages are `en`, `fr`, `ptBr` and `ru` |

## Automatic browser language detection Support

Verbum supports automatic browser language detection by default if locale not provided. If the browser language is set to `fr`, the editor will be automatically localized in French. If the browser language is set to `en`, the editor will be automatically localized in English. If the browser language is set to any other language, the editor will be automatically localized in English.

<br />

## Plugins

`<ToolbarPlugin />`

| Property          | Type                   |          | description                                                                                      |
| ----------------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| children          | `React.ReactElement[]` | optional | Nested child components, like the `InsertDropdown`                                               |
| defaultFontSize   | `string`               | optional | The default font size selected when the editor first loaded, default value is `15px`             |
| defaultFontColor  | `string`               | optional | The default font color selected when the editor first loaded, default value is `#000`            |
| defaultBgColor    | `string`               | optional | The default text background color selected when the editor first loaded, default value is `#fff` |
| defaultFontFamily | `string`               | optional | The default font family selected when the editor first loaded, default value is `Arial`          |

<br />

### Toolbar components

`<FontFamilyDropdown />`

Add your own font families.

| Property    | Type                               |          | description   |
| ----------- | ---------------------------------- | -------- | ------------- |
| fontOptions | `FontOptions = [string, string][]` | optional | List of fonts |

`<FontSizeDropdown />`

Add your own font sizes.

| Property        | Type                               |          | description        |
| --------------- | ---------------------------------- | -------- | ------------------ |
| fontSizeOptions | `FontOptions = [string, string][]` | optional | List of font sizes |

<br />

`<InsertDropdown />`

| Property             | Type      |          | description                                      |
| -------------------- | --------- | -------- | ------------------------------------------------ |
| enableTable          | `boolean` | optional | Enables table inserting feature                  |
| enableYoutube        | `boolean` | optional | Enables youtube video inserting feature          |
| enableTwitter        | `boolean` | optional | Enables tweet inserting feature                  |
| enablePoll           | `boolean` | optional | Enables poll inserting feature                   |
| enableImage          | `boolean` | optional | Enables image inserting feature                  |
| enableEquations      | `boolean` | optional | Enables equation inserting feature               |
| enableExcalidraw     | `boolean` | optional | Enables diagram inserting feature                |
| enableHorizontalRule | `boolean` | optional | Enables the horizontal rule inserting for layout |
| enableStickyNote     | `boolean` | optional | Enables stick note inserting for layout          |

<br />

`<MentionsPlugin />`

| Property           | Type                    |          | description                       |
| ------------------ | ----------------------- | -------- | --------------------------------- |
| searchData         | `SearchData<A>`         | required | Searching data using input string |
| getTypeaheadValues | `GetTypeaheadValues<A>` | required | Search data transormation         |

### Plugins support

| Plugin name                | Working            | Description                                    | Source                     |
| -------------------------- | ------------------ | ---------------------------------------------- | -------------------------- |
| ActionsPlugin              | :white_check_mark: | Action menu in the right bottom corner         | Editor.tsx                 |
| AutoLinkPlugin             | :white_check_mark: | Auto highlight links                           | Editor.tsx                 |
| CharacterStylesPopupPlugin | :white_check_mark: | Modal style editor for selected text           | Independent                |
| ClickableLinkPlugin        | :white_check_mark: | Enable to open links in new tab                | Independent                |
| CodeHighlightPlugin        | :white_check_mark: | Code Block with different languages            | Independent                |
| CommentPlugin              | :x:                |                                                | CharacterStylesPopupPlugin |
| EmojisPlugin               | :white_check_mark: | A few emojis                                   | Editor.tsx                 |
| EquationsPlugin            | :scissors:         | Katex, It's too heavy (cut out)                | InsertDropdown.tsx         |
| ExcalidrawPlugin           | :scissors:         | Excalidraw (cut out)                           | InsertDropdown.tsx         |
| HorizontalRulePlugin       | :white_check_mark: | Horizontal divider                             | InsertDropdown.tsx         |
| ImagesPlugin               | :x:                | Insert file only (no URLs)                     | InsertDropdown.tsx         |
| KeywordsPlugin             | :x:                |                                                | Independent                |
| ListMaxIndentLevelPlugin   | :white_check_mark: | Max Indent Level (bullet, numeric)             | Independent                |
| MarkdownShortcutPlugin     | :white_check_mark: | Convert into Markdown format                   | ActionsPlugin              |
| MentionsPlugin             | :white_check_mark: | Mentions, starts with `@`                      | Independent                |
| PollPlugin                 | :x:                | Poll, need test with many votes                | InsertDropdown.tsx         |
| SpeechToTextPlugin         | :white_check_mark: | Voice recognition to text                      | ActionsPlugin              |
| StickyPlugin               | :x:                | Yellow sticker, there is a bug with text style | InsertDropdown.tsx         |
| TabFocusPlugin             |                    |                                                |                            |
| TableActionMenuPlugin      | :white_check_mark: | Create table                                   | InsertDropdown.tsx         |
| TestRecorderPlugin         |                    |                                                |                            |
| TreeViewPlugin             |                    |                                                |                            |
| TwitterPlugin              | :white_check_mark: | Insert twits                                   | InsertDropdown.tsx         |
| TypingPerfPlugin           |                    |                                                |                            |
| YouTubePlugin              | :white_check_mark: | Insert YouTube videos                          | InsertDropdown.tsx         |

## Development

For development use:

```
$ npm install (in case of an error, run `npm install --legacy-peer-deps`)
$ npm start
```

Also you can test it locally using Storybook:

```
$ npm run storybook
```

## Future plans

- Test coverage
- ~~Programmatic access to the editor input as JSON~~
- ~~Localization~~
- Ready templates with different options (MUI, Bootstrap, etc...)
- Dark/Light modes
- Custom styling flexibility
- ~~Disassembling all of the toolbar to enable using them as nested components, increasing the flexibility~~
- ~~Enabling adjusting editor settings such read-only mode and etc. programmatically~~

## License

Licensed under MIT License.
