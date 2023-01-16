import Rect from './Rect';
import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Circle extends Rect {
  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.name = ToolNames.CIRCLE;
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      this.width = e.pageX - target.offsetLeft;
      this.height = e.pageY - target.offsetTop;

      this.isShift = e.shiftKey;

      this.localDraw({
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
        isShift: this.isShift,
      });
    }
  }
}
