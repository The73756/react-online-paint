import Rect from './Rect';
import { CanvasType, CanvasWSMethods, MessageType } from '../types/canvas';
import { ToolNames } from '../types/tools';
import toolState from '../store/toolState';

export default class Line extends Rect {
  private currentX = 0;
  private currentY = 0;

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.name = ToolNames.LINE;
  }

  public mouseUpHandler() {
    this.mouseDown = false;

    this.socket?.send(
      JSON.stringify({
        method: CanvasWSMethods.DRAW,
        id: this.sessionId,
        figure: {
          type: this.name,
          x: this.currentX,
          y: this.currentY,
          startX: this.startX,
          startY: this.startY,
          lineWidth: toolState.lineWidth,
          strokeColor: toolState.strokeColor,
        },
      } as MessageType),
    );
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;
    this.currentX = e.pageX - target.offsetLeft;
    this.currentY = e.pageY - target.offsetTop;

    if (this.mouseDown) {
      this.localDraw({
        x: this.currentX,
        y: this.currentY,
        startX: this.startX,
        startY: this.startY,
      });
    }
  }
}
