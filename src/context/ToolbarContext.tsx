import { LexicalEditor } from 'lexical';
import React, { createContext } from 'react';

interface IToolbarContext {
  isRTL: boolean;
  canUndo: boolean;
  canRedo: boolean;
  fontFamily: string;
  fontSize: string;
  applyStyleText: (styles: Record<string, string>) => void;
}

const ToolbarContext = createContext<IToolbarContext | null>(null);

export default ToolbarContext;
