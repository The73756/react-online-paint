export enum ToolNames {
  BRUSH = 'BRUSH',
  ERASER = 'ERASER',
  RECT = 'RECT',
  CIRCLE = 'CIRCLE',
  LINE = 'LINE',
  EMPTY = '',
}

export interface FigureType {
  type: ToolNames;
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  startX?: number;
  startY?: number;
  lineWidth: number;
  fillColor: string;
  strokeColor: string;
}

export interface LocalFigureType {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  startX?: number;
  startY?: number;
}
