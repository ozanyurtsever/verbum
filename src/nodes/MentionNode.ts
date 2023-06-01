/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorConfig, LexicalNode, NodeKey } from 'lexical';

import SerializedTextNode from 'lexical';

import { Spread } from 'globals';
import { TextNode } from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    type: 'mention';
    version: 1;
  },
  typeof SerializedTextNode
>;

type PopoverCard = {
  card: HTMLElement;
  leftOffset: number;
  topOffset: number;
};

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';

export class MentionNode extends TextNode {
  __mention: string;
  __popoverCard: PopoverCard;

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
    popover?: PopoverCard,
    text?: string,
    key?: NodeKey
  ) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    if (popover !== undefined) {
      this.__popoverCard = popover;
      this.__popoverCard.card.id = 'verbum-mention-popover';
      this.__popoverCard.card.style.position = 'absolute';
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
    const existingPopover = document.getElementById(this.__popoverCard.card.id);
    if (existingPopover && existingPopover.parentElement) {
      existingPopover.parentElement.removeChild(existingPopover);
    }
  };

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = 'mention';

    dom.addEventListener('pointerover', (event) => {
      const { left, top } = dom.getBoundingClientRect();
      this.__popoverCard.card.style.left = `${left - this.__popoverCard.leftOffset}px`;
      this.__popoverCard.card.style.top = `${top - this.__popoverCard.topOffset}px`;
      document.body.appendChild(this.__popoverCard.card);
    });

    dom.addEventListener('pointerout', (event) => {
      this.removePopover();
    });

    return dom;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createMentionNode(
  mentionName: string,
  popover?: PopoverCard
): MentionNode {
  const mentionNode = new MentionNode(mentionName, popover);
  mentionNode.setMode('segmented').toggleDirectionless();
  return mentionNode;
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}
