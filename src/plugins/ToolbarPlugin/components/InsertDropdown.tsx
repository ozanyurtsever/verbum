import React, { useState, useCallback, useContext } from 'react';
import { $getRoot, LexicalEditor, RangeSelection } from 'lexical';
import DropDown from '../../../ui/DropDown';
import Button from '../../../ui/Button';
import TextInput from '../../../ui/TextInput';
import FileInput from '../../../ui/FileInput';
import ImagesPlugin, {
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
} from '../../ImagesPlugin';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import PollPlugin, { INSERT_POLL_COMMAND } from '../../PollPlugin';
import TwitterPlugin, { INSERT_TWEET_COMMAND } from '../../TwitterPlugin';
import YouTubePlugin, { INSERT_YOUTUBE_COMMAND } from '../../YouTubePlugin';
import { $createStickyNode } from '../../../nodes/StickyNode';
import useModal from '../../../hooks/useModal';
import TableCellResizer from '../../TableCellResizer';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import TableCellActionMenuPlugin from '../../TableActionMenuPlugin';
import HorizontalRulePlugin from '../../HorizontalRulePlugin';
import EditorContext from '../../../context/EditorContext';

// Taken from https://stackoverflow.com/a/9102270
const YOUTUBE_ID_PARSER =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

const parseYouTubeVideoID = (url: string) => {
  const urlMatches = url.match(YOUTUBE_ID_PARSER);

  return urlMatches?.[2].length === 11 ? urlMatches[2] : null;
};

//#region Inserting different modules
function InsertImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };

  return (
    <>
      {!mode && (
        <div className="ToolbarPlugin__dialogButtonsList">
          <Button
            data-test-id="image-modal-option-sample"
            onClick={() =>
              onClick({
                altText: 'Yellow flower in tilt shift lens',
                src: null, //yellowFlowerImage,
              })
            }
          >
            Sample
          </Button>
          <Button
            data-test-id="image-modal-option-url"
            onClick={() => setMode('url')}
          >
            URL
          </Button>
          <Button
            data-test-id="image-modal-option-file"
            onClick={() => setMode('file')}
          >
            File
          </Button>
        </div>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  );
}

function InsertTableDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [rows, setRows] = useState('5');
  const [columns, setColumns] = useState('5');

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows });
    onClose();
  };

  return (
    <>
      <TextInput label="No of rows" onChange={setRows} value={rows} />
      <TextInput label="No of columns" onChange={setColumns} value={columns} />
      <div
        className="ToolbarPlugin__dialogActions"
        data-test-id="table-model-confirm-insert"
      >
        <Button onClick={onClick}>Confirm</Button>
      </div>
    </>
  );
}

function InsertPollDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [question, setQuestion] = useState('');

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_POLL_COMMAND, question);
    onClose();
  };

  return (
    <>
      <TextInput label="Question" onChange={setQuestion} value={question} />
      <div className="ToolbarPlugin__dialogActions">
        <Button disabled={question.trim() === ''} onClick={onClick}>
          Confirm
        </Button>
      </div>
    </>
  );
}

const VALID_TWITTER_URL = /twitter.com\/[0-9a-zA-Z]{1,20}\/status\/([0-9]*)/g;

function InsertTweetDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [text, setText] = useState('');

  const onClick = () => {
    const tweetID = text.split('status/')?.[1]?.split('?')?.[0];
    activeEditor.dispatchCommand(INSERT_TWEET_COMMAND, tweetID);
    onClose();
  };

  const isDisabled = text === '' || !text.match(VALID_TWITTER_URL);

  return (
    <>
      <TextInput
        label="Tweet URL"
        placeholder="i.e. https://twitter.com/jack/status/20"
        onChange={setText}
        value={text}
      />
      <div className="ToolbarPlugin__dialogActions">
        <Button disabled={isDisabled} onClick={onClick}>
          Confirm
        </Button>
      </div>
    </>
  );
}

function InsertImageUriDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  return (
    <>
      <TextInput
        label="Image URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={setSrc}
        value={src}
        data-test-id="image-modal-url-input"
      />
      <TextInput
        label="Alt Text"
        placeholder="Random unsplash image"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <div className="ToolbarPlugin__dialogActions">
        <Button
          data-test-id="image-modal-confirm-btn"
          disabled={isDisabled}
          onClick={() => onClick({ altText, src })}
        >
          Confirm
        </Button>
      </div>
    </>
  );
}

function InsertImageUploadedDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  const loadImage = (files: FileList) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
      return '';
    };
    reader.readAsDataURL(files[0]);
  };

  return (
    <>
      <FileInput
        label="Image Upload"
        onChange={loadImage}
        accept="image/*"
        data-test-id="image-modal-file-upload"
      />
      <TextInput
        label="Alt Text"
        placeholder="Descriptive alternative text"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <div className="ToolbarPlugin__dialogActions">
        <Button
          data-test-id="image-modal-file-upload-btn"
          disabled={isDisabled}
          onClick={() => onClick({ altText, src })}
        >
          Confirm
        </Button>
      </div>
    </>
  );
}

function InsertYouTubeDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [text, setText] = useState('');

  const onClick = () => {
    const videoID = parseYouTubeVideoID(text);
    if (videoID) {
      activeEditor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoID);
    }
    onClose();
  };

  const isDisabled = text === '' || !parseYouTubeVideoID(text);

  return (
    <>
      <TextInput
        data-test-id="youtube-embed-modal-url"
        label="YouTube URL"
        placeholder="i.e. https://www.youtube.com/watch?v=jNQXAC9IVRw"
        onChange={setText}
        value={text}
      />
      <div className="ToolbarPlugin__dialogActions">
        <Button
          data-test-id="youtube-embed-modal-submit-btn"
          disabled={isDisabled}
          onClick={onClick}
        >
          Confirm
        </Button>
      </div>
    </>
  );
}

//#endregion Inserting different modules

export interface IInsertDropdownProps {
  enableTable?: boolean;
  enableYoutube?: boolean;
  enableTwitter?: boolean;
  enablePoll?: boolean;
  enableImage?: { enable: boolean; maxWidth: number };
  enableEquations?: boolean;
  enableExcalidraw?: boolean;
  enableHorizontalRule?: boolean;
  enableStickyNote?: boolean;
}

const InsertDropdown: React.FC<IInsertDropdownProps> = ({
  enableTable = true,
  enableImage = { enable: true, maxWidth: 1000 },
  enableYoutube = false,
  enableTwitter = false,
  enablePoll = false,
  enableHorizontalRule = false,
  enableStickyNote = false,
}: IInsertDropdownProps) => {
  const { initialEditor, activeEditor } = useContext(EditorContext);
  const [modal, showModal] = useModal();

  return (
    <div>
      {enableTable && (
        <>
          <TablePlugin />
          <TableCellActionMenuPlugin />
          <TableCellResizer />
        </>
      )}
      {enableYoutube && <YouTubePlugin />}
      {enableTwitter && <TwitterPlugin />}
      {enablePoll && <PollPlugin />}
      {enableImage.enable && <ImagesPlugin maxWidth={enableImage.maxWidth} />}
      {enableHorizontalRule && <HorizontalRulePlugin />}

      <DropDown
        buttonClassName="toolbar-item spaced"
        buttonLabel="Insert"
        buttonAriaLabel="Insert specialized editor node"
        buttonIconClassName="icon plus"
      >
        {enableHorizontalRule && (
          <button
            onClick={() => {
              activeEditor.dispatchCommand(
                INSERT_HORIZONTAL_RULE_COMMAND,
                undefined
              );
            }}
            className="item"
            type="button"
          >
            <i className="icon horizontal-rule" />
            <span className="text">Horizontal Rule</span>
          </button>
        )}
        {enableImage.enable && (
          <button
            onClick={() => {
              showModal('Insert Image', (onClose) => (
                <InsertImageDialog
                  activeEditor={activeEditor}
                  onClose={onClose}
                />
              ));
            }}
            className="item"
            type="button"
          >
            <i className="icon image" />
            <span className="text">Image</span>
          </button>
        )}
        {enableTable && (
          <div>
            <button
              onClick={() => {
                showModal('Insert Table', (onClose) => (
                  <InsertTableDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
              type="button"
            >
              <i className="icon table" />
              <span className="text">Table</span>
            </button>
          </div>
        )}
        {enablePoll && (
          <button
            onClick={() => {
              showModal('Insert Poll', (onClose) => (
                <InsertPollDialog
                  activeEditor={activeEditor}
                  onClose={onClose}
                />
              ));
            }}
            className="item"
            type="button"
          >
            <i className="icon poll" />
            <span className="text">Poll</span>
          </button>
        )}
        {enableTwitter && (
          <button
            onClick={() => {
              showModal('Insert Tweet', (onClose) => (
                <InsertTweetDialog
                  activeEditor={activeEditor}
                  onClose={onClose}
                />
              ));
            }}
            className="item"
            type="button"
          >
            <i className="icon tweet" />
            <span className="text">Tweet</span>
          </button>
        )}
        {enableYoutube && (
          <button
            onClick={() => {
              showModal('Insert YouTube Video', (onClose) => (
                <InsertYouTubeDialog
                  activeEditor={activeEditor}
                  onClose={onClose}
                />
              ));
            }}
            className="item"
            type="button"
          >
            <i className="icon youtube" />
            <span className="text">YouTube Video</span>
          </button>
        )}
        {enableStickyNote && (
          <button
            onClick={() => {
              initialEditor.update(() => {
                const root = $getRoot();
                const stickyNode = $createStickyNode(0, 0);
                root.append(stickyNode);
              });
            }}
            className="item"
            type="button"
          >
            <i className="icon sticky" />
            <span className="text">Sticky Note</span>
          </button>
        )}
      </DropDown>
      {modal}
    </div>
  );
};

export default InsertDropdown;
