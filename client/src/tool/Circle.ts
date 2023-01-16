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
      const currentX = e.pageX - target.offsetLeft;
      const currentY = e.pageY - target.offsetTop;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;
      this.radiusX = Math.sqrt(this.width ** 2 + this.height ** 2);
      this.radiusY = Math.sqrt(this.width ** 2 + this.height ** 2);

      this.localDraw({
        x: this.startX,
        y: this.startY,
        radiusX: this.radiusX,
        radiusY: this.radiusY,
      });
    }
  }
}
