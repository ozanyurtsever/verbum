import { LexicalEditor } from 'lexical';
import React, { createContext } from 'react';

interface IToolbarContext {
  isRTL: boolean;
}

const ToolbarContext = createContext<IToolbarContext | null>(null);

export default ToolbarContext;
