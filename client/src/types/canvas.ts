import { ToolType } from './tools';

export type CanvasType = HTMLCanvasElement | null;

export enum CanvasWSMethods {
  CONNECT = 'connection',
  DRAW = 'draw',
  RELEASE_FIGURE = 'release_figure',
  UNDO = 'undo',
  REDO = 'redo',
  CLEAR = 'clear',
  DISCONNECT = 'disconnect',
}

export interface MessageType {
  method: CanvasWSMethods;
  username: string;
  id: string;
  figure: ToolType;
}
