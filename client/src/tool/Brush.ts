import Tool from './Tool';
import { CanvasType, CanvasWSMethods, MessageType } from '../types/canvas';
import { ToolNames } from '../types/tools';
import toolState from '../store/toolState';

export default class Brush extends Tool {
  public mouseDown = false;
  public keyDown = false;

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

    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    const subtract = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
      x: a.x - b.x,
      y: a.y - b.y,
    });

    const center = {
      x: target.width / 2 + target.offsetLeft,
      y: target.width / 2 + target.offsetTop,
    }; // {x: 960, y: 634}
    const mc = subtract({ x: e.clientX, y: e.clientY }, center);
    let direction = this.normalizeVector(mc);
    let angle = (Math.atan2(direction.y, direction.x) * 180) / Math.PI;
    console.log(angle);

    let x = e.pageX - target.offsetLeft;
    let y = e.pageY - target.offsetTop;

    if ((angle <= -45 && angle > -130) || (angle > 45 && angle <= 130)) {
      // console.log('по вертикали');
    } else if (
      (angle > -180 && angle <= -130) ||
      (angle <= 180 && angle > 130) ||
      (angle <= 45 && angle > -45)
    ) {
      // console.log('по горизонтали');
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
