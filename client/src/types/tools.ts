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
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  lineWidth?: number;
  fillColor?: string;
  strokeColor?: string;
}

export interface RectType extends FigureType {
  type: ToolNames.RECT;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleType extends FigureType {
  type: ToolNames.CIRCLE;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

export type ToolType = RectType | CircleType;
