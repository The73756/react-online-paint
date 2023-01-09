import { ToolNames } from './tools';

export type CanvasType = HTMLCanvasElement | null;

export enum CanvasWSMethods {
  CONNECT = 'connection',
  DRAW = 'draw',
}

export interface MessageType {
  method: CanvasWSMethods;
  username: string;
  id: string;
  figure: {
    type: ToolNames;
    x: number;
    y: number;
  };
}
