import Tool from './Tool';
import { CanvasType, CanvasWSMethods, MessageType } from '../../types/canvas';
import { ToolNames } from '../../types/tools';
import toolState from '../../store/toolState';

export default class Brush extends Tool {
  public mouseDown = false;
  private oldX = 0;
  private oldY = 0;

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

  // Окончание рисования
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

    if (e.shiftKey) {
      this.oldX = e.pageX - target.offsetLeft;
      this.oldY = e.pageY - target.offsetTop;
    }

    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    let x = e.pageX - target.offsetLeft;
    let y = e.pageY - target.offsetTop;

    if (e.shiftKey && this.mouseDown) {
      const deltaY = Math.abs(y - this.oldY);
      const deltaX = Math.abs(x - this.oldX);

      deltaY > 0 && deltaY > deltaX ? (x = this.oldX) : (y = this.oldY);
    }

    if (this.mouseDown) {
      this.socket?.send(
        JSON.stringify({
          method: CanvasWSMethods.DRAW,
          id: this.sessionId,
          figure: {
            type: this.name,
            x,
            y,
            lineWidth: toolState.lineWidth,
            strokeColor: toolState.strokeColor,
          },
        } as MessageType),
      );
    }
  }
}
