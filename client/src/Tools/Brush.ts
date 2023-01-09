import Tool from './Tool';
import { CanvasType, CanvasWSMethods } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Brush extends Tool {
  private mouseDown = false;

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.listen();
    this.name = ToolNames.BRUSH;
  }

  private listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }

  private mouseUpHandler() {
    this.mouseDown = false;

    this.socket?.send(
      JSON.stringify({
        method: CanvasWSMethods.DRAW,
        id: this.sessionId,
        figure: {
          type: ToolNames.EMPTY,
        },
      }),
    );
  }

  private mouseDownHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  private mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      this.socket?.send(
        JSON.stringify({
          method: CanvasWSMethods.DRAW,
          id: this.sessionId,
          figure: {
            type: ToolNames.BRUSH,
            x: e.pageX - target.offsetLeft,
            y: e.pageY - target.offsetTop,
          },
        }),
      );
    }
  }

  public static draw(ctx: CanvasRenderingContext2D, x: number, y: number, w?: number, h?: number) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
