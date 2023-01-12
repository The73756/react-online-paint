import { FigureType } from './tools';

export type CanvasType = HTMLCanvasElement | null;

export enum CanvasWSMethods {
  CONNECT = 'connection',
  DRAW = 'draw',
  RELEASE_FIGURE = 'release_figure',
  UNDO = 'undo',
  REDO = 'redo',
}

export interface MessageType {
  method: CanvasWSMethods;
  username: string;
  id: string;
  figure: FigureType;
}
