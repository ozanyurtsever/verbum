/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
} from 'lexical';

import SerializedTextNode from 'lexical';

import { Spread } from 'globals';
import { TextNode } from 'lexical';
import { ReactNode } from 'react';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    type: 'mention';
    version: 1;
  },
  typeof SerializedTextNode
>;

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';

// const message = document.createElement('p');
// message.textContent = 'Here is an example popover';

const node: ReactNode = undefined;

export class MentionNode extends TextNode {
  __mention: string;
  __popover: HTMLElement; // = document.createElement('div');
  // __position: {left: number, top: number}

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, undefined, node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(serializedNode.mentionName);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(
    mentionName: string,
    popover?: HTMLDivElement,
    text?: string,
    key?: NodeKey,
  ) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    if (popover !== undefined) {
       this.__popover = popover;
       this.__popover.id = 'verbum-mention-popover';
      // this.__popover.style.backgroundColor = '#0078D4';
      // this.__popover.style.color = 'white';
      // this.__popover.style.border = '1px solid black';
       this.__popover.style.position = 'absolute';
      // this.__popover.style.width = '200px';
      // this.__popover.style.height = '100px';
      // this.__popover.style.padding = '10px';
      // this.__popover.appendChild(message);
      this.removePopover();
    }
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      type: 'mention',
      version: 1,
    };
  }

  removePopover = () => {
    const existingPopover = document.getElementById(this.__popover.id);
    if (existingPopover && existingPopover.parentElement) {
      existingPopover.parentElement.removeChild(existingPopover);
    }
  };

  setPosition = (elemet: HTMLElement) => {


  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = 'mention';

    dom.addEventListener('pointerover', (event) => {
      console.log('over');
      this.setPosition(dom)
      const {left, top} = dom.getBoundingClientRect()
      //const {width, height} = this.__popover.getBoundingClientRect()
      this.__popover.style.left = `${left}px`;
      this.__popover.style.top = `${top - 125}px`;
      document.body.appendChild(this.__popover);
    });

    dom.addEventListener('pointerout', (event) => {
      console.log('out');
      this.removePopover();
    });

    //console.log(dom);
    return dom;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createMentionNode(mentionName: string, popover?: HTMLDivElement): MentionNode {
  const mentionNode = new MentionNode(mentionName, popover);
  mentionNode.setMode('segmented').toggleDirectionless();
  return mentionNode;
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}
