import Tool from '../main/Tool';
import { CanvasType } from '../../types/canvas';
import { FigureType, ToolNames, ToolType } from '../../types/tools';
import toolState from '../../store/toolState';
import { drawSend } from '../../ws/senders';
import CanvasState from '../../store/canvasState';

export default class SimpleToolHandler extends Tool {
  public mouseDown = false;
  public x = 0;
  public y = 0;
  private oldX = 0;
  private oldY = 0;

  public setCurrentProps: (() => ToolType) | null = null;
  public localDrawFunc: (() => void) | null = null;

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.listen();
  }

  public listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.stopDrawingHandler.bind(this);

      this.canvas.ontouchmove = this.touchMoveHandler.bind(this);
      this.canvas.ontouchstart = this.touchStartHandler.bind(this);
      this.canvas.ontouchend = this.stopDrawingHandler.bind(this);
    }
  }

  private drawingHandler() {
    if (this.mouseDown) {
      if (this.localDrawFunc) {
        this.localDrawFunc();
      } else {
        console.error('localDrawFunc is not defined');
      }

      if (this.setCurrentProps) {
        const currentProps = this.setCurrentProps();
        const figure: ToolType = {
          ...currentProps,
          scaleFactor: CanvasState.canvasScaleFactor,
          lineWidth: toolState.lineWidth,
          strokeColor: toolState.strokeColor,
        };
        drawSend(figure);
      } else {
        console.error('setCurrentProps is not defined');
      }
    }
  }

  private stopDrawingHandler() {
    this.mouseDown = false;
    this.ctx?.beginPath();

    drawSend({
      type: ToolNames.EMPTY,
    });
  }

  private mouseDownHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;
    this.mouseDown = true;

    if (e.shiftKey) {
      this.oldX = e.pageX - target.offsetLeft;
      this.oldY = e.pageY - target.offsetTop;
    }

    if (this.ctx) {
      this.ctx.lineWidth = toolState.lineWidth;
      this.ctx.fillStyle = toolState.fillColor;
      this.ctx.strokeStyle = toolState.strokeColor;
      this.ctx?.beginPath();
      this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
    }
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

    this.drawingHandler();
  }
  private touchStartHandler(e: TouchEvent) {
    e.preventDefault();
    const target = e.target as HTMLCanvasElement;
    this.mouseDown = true;
    const pageX = e.touches[0].pageX;
    const pageY = e.touches[0].pageY;

    if (this.ctx) {
      this.ctx.lineWidth = toolState.lineWidth;
      this.ctx.fillStyle = toolState.fillColor;
      this.ctx.strokeStyle = toolState.strokeColor;
      this.ctx?.beginPath();
      this.ctx?.moveTo(pageX - target.offsetLeft, pageY - target.offsetTop);
    }
  }

  private touchMoveHandler(e: TouchEvent) {
    e.preventDefault();
    const target = e.target as HTMLCanvasElement;
    const pageX = e.touches[0].pageX;
    const pageY = e.touches[0].pageY;
    this.x = pageX - target.offsetLeft;
    this.y = pageY - target.offsetTop;

    this.drawingHandler();
  }

  public static onlineDraw(
    ctx: CanvasRenderingContext2D,
    figure: FigureType,
    drawFunc: (ctx: CanvasRenderingContext2D, figure: FigureType) => void,
  ) {
    super.setDrawStyle(ctx, figure);
    drawFunc(ctx, figure);

    ctx.stroke();
  }
}
