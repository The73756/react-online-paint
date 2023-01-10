import Rect from './Rect';
import { CanvasType, CanvasWSMethods, MessageType } from '../types/canvas';
import { ToolNames } from '../types/tools';
import toolState from '../store/toolState';

export default class Line extends Rect {
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
          x: this.startX,
          y: this.startY,
          lineWidth: toolState.lineWidth,
          strokeColor: toolState.strokeColor,
        },
      } as MessageType),
    );
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      this.localDraw({
        x: e.pageX - target.offsetLeft,
        y: e.pageY - target.offsetTop,
        startX: this.startX,
        startY: this.startY,
      });
    }
  }
}
