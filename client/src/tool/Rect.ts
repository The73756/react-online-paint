import Tool from './Tool';
import { CanvasType, CanvasWSMethods, MessageType } from '../types/canvas';
import { ToolNames } from '../types/tools';
import toolState from '../store/toolState';

export default class Rect extends Tool {
  public mouseDown = false;
  public startX = 0;
  public startY = 0;
  public saved = '';
  public width = 0;
  public height = 0;
  public radiusX = 0;
  public radiusY = 0;

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.listen();
    this.name = ToolNames.RECT;
  }

  private listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }

  public mouseUpHandler() {
    this.mouseDown = false;

    this.socket?.send(
      JSON.stringify({
        method: CanvasWSMethods.DRAW,
        id: this.sessionId,
        figure: {
          type: this.name,
          x: this.startX,
          y: this.startY,
          radiusX: this.radiusX,
          radiusY: this.radiusY,
          width: this.width,
          height: this.height,
          lineWidth: toolState.lineWidth,
          strokeColor: toolState.strokeColor,
          fillColor: toolState.fillColor,
        },
      } as MessageType),
    );
  }

  private mouseDownHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    this.mouseDown = true;
    this.ctx?.beginPath();
    this.startX = e.pageX - target.offsetLeft;
    this.startY = e.pageY - target.offsetTop;
    this.saved = this.canvas?.toDataURL() as string;
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      const currentX = e.pageX - target.offsetLeft;
      const currentY = e.pageY - target.offsetTop;
      this.width = currentX - this.startX;
      this.height = e.shiftKey ? this.width : currentY - this.startY;

      this.localDraw({ x: this.startX, y: this.startY, width: this.width, height: this.height });
    }
  }
}
