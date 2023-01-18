import Brush from './Brush';
import { CanvasType } from '../../types/canvas';
import { ToolNames } from '../../types/tools';

export default class Eraser extends Brush {
  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.name = ToolNames.ERASER;
  }
}
