import Tool from '../main/Tool';
import { CanvasType } from '../../types/canvas';
import { FigureType, ToolNames, ToolType } from '../../types/tools';
import toolState from '../../store/toolState';
import { drawSend } from '../../ws/senders';

export default class SimpleToolHandler extends Tool {
  public mouseDown = false;
  public x = 0;
  public y = 0;
  private oldX = 0;
  private oldY = 0;

  public setCurrentProps: (() => ToolType) | null = null;

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.listen();
  }

  public listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }

  private mouseUpHandler() {
    this.mouseDown = false;

    drawSend({
      type: ToolNames.EMPTY,
    });
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

    this.x = e.pageX - target.offsetLeft;
    this.y = e.pageY - target.offsetTop;

    if (e.shiftKey && this.mouseDown) {
      const deltaY = Math.abs(this.y - this.oldY);
      const deltaX = Math.abs(this.x - this.oldX);

      deltaY > 0 && deltaY > deltaX ? (this.x = this.oldX) : (this.y = this.oldY);
    }

    if (this.mouseDown) {
      if (this.setCurrentProps) {
        const currentProps = this.setCurrentProps();
        const figure: ToolType = {
          ...currentProps,
          lineWidth: toolState.lineWidth,
          strokeColor: toolState.strokeColor,
        };
        drawSend(figure);
      } else {
        console.error('setCurrentProps is not defined');
      }
    }
  }

  public static onlineDraw(
    ctx: CanvasRenderingContext2D,
    figure: FigureType,
    drawFunc: (ctx: CanvasRenderingContext2D, figure: FigureType) => void,
  ) {
    const { lineWidth, fillColor, strokeColor } = figure;
    ctx.lineWidth = lineWidth || toolState.lineWidth;
    ctx.fillStyle = fillColor || toolState.fillColor;
    ctx.strokeStyle = strokeColor || toolState.strokeColor;

    drawFunc(ctx, figure);

    ctx.stroke();
  }
}
