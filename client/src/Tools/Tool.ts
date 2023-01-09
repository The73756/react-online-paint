import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';
import toolState from '../store/toolState';

export default class Tool {
  public canvas: CanvasType;
  public socket: WebSocket | null;
  public sessionId: string;
  public ctx: CanvasRenderingContext2D | null | undefined;
  public name = ToolNames.EMPTY;

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
    }
  }
}
