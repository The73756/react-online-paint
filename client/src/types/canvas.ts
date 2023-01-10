import { ToolNames } from './tools';

export type CanvasType = HTMLCanvasElement | null;

export enum CanvasWSMethods {
  CONNECT = 'connection',
  DRAW = 'draw',
}

export interface FigureType {
  type: ToolNames;
  x: number;
  y: number;
  width: number;
  height: number;
  lineWidth: number;
  fillColor: string;
  strokeColor: string;
}

export interface MessageType {
  method: CanvasWSMethods;
  username: string;
  id: string;
  figure: FigureType;
}
