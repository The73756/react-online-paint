import { CanvasType } from '../../types/canvas';
import { FigureType, ToolNames } from '../../types/tools';
import toolState from '../../store/toolState';
import canvasState from '../../store/canvasState';

export default class Tool {
  public canvas: CanvasType;
  public socket: WebSocket | null;
  public sessionId: string;
  public ctx: CanvasRenderingContext2D | null | undefined;
  public name = ToolNames.EMPTY;
  public saved = '';

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.sessionId = sessionId;
    this.ctx = this.canvas?.getContext('2d');

    this.destroyEvents();

    if (this.ctx) {
      this.ctx.fillStyle = toolState.currentFillColor;
      this.ctx.strokeStyle = toolState.currentStrokeColor;
      this.ctx.lineWidth = toolState.currentLineWidth;
    }
  }

  set fillColor(color: string) {
    if (this.ctx) {
      this.ctx.fillStyle = color;
    }
  }

  set strokeColor(color: string) {
    if (this.ctx) {
      this.ctx.strokeStyle = color;
    }
  }

  set lineWidth(width: number) {
    if (this.ctx) {
      this.ctx.lineWidth = width;
    }
  }

  private destroyEvents() {
    if (this.canvas) {
      this.canvas.onmousemove = null;
      this.canvas.onmousedown = null;
      this.canvas.onmouseup = null;

      this.canvas.ontouchmove = null;
      this.canvas.ontouchstart = null;
      this.canvas.ontouchend = null;
    }
  }

  public static calcScaleFactor(canvasScaleFactor: number, scaleFactor: number) {
    let scale: number;

    if (canvasScaleFactor > 1) {
      scale = canvasScaleFactor < scaleFactor ? canvasScaleFactor / scaleFactor : canvasScaleFactor;
    } else if (canvasScaleFactor === 1) {
      scale = canvasScaleFactor / scaleFactor;
    } else {
      scale =
        canvasScaleFactor < scaleFactor
          ? scaleFactor > 1
            ? canvasScaleFactor
            : canvasScaleFactor / scaleFactor
          : canvasScaleFactor;
    }

    toolState.setToolScaleFactor(Math.abs(scale));
  }

  public static setDrawStyle(ctx: CanvasRenderingContext2D, figure: FigureType) {
    const { lineWidth, fillColor, strokeColor, scaleFactor } = figure;
    const cachedScaleFactor = toolState.cachedScaleFactor;

    if (scaleFactor && scaleFactor !== cachedScaleFactor) {
      Tool.calcScaleFactor(canvasState.canvasScaleFactor, scaleFactor);
      toolState.setCachedScaleFactor(scaleFactor);
    }

    ctx.lineWidth = lineWidth
      ? Math.floor(lineWidth * canvasState.canvasScaleFactor)
      : toolState.lineWidth;
    ctx.fillStyle = fillColor || toolState.fillColor;
    ctx.strokeStyle = strokeColor || toolState.strokeColor;
  }
}
