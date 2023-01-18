import { CanvasType } from '../types/canvas';
import { FigureType, LocalFigureType, ToolNames } from '../types/tools';
import toolState from '../store/toolState';

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
    }
  }

  public static drawCircle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    isShift?: boolean,
  ) {
    const radiusX = Math.abs((width - x) * 0.5);
    const radiusY = isShift ? radiusX : Math.abs((height - y) * 0.5);
    let centerX: number;
    let centerY: number;

    if (width >= x) {
      centerX = x + radiusX;
    } else {
      centerX = x - radiusX;
    }

    if (height >= y) {
      centerY = y + radiusY;
    } else {
      centerY = y - radiusY;
    }

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  }

  /* Рисование со свичем не знаю как вынести из-за static draw
      В LocalDraw можно попробовать принимать каллбек ибо перезатирание канваса использется везде
      Надо рефакторить ибо мне не нравится drawCircle тут конкретно
      Возможно стоит инкапсулировать методы draw и localDraw в классы фигур
      Пока не оптимизировал - работал над функционалом
    */

  //TODO: РЕФАКТОР ВСЕХ ИНСТРУМЕНТОВ!!!

  public localDraw({ x, y, width, height, startX, startY, isShift }: LocalFigureType) {
    const img = new Image();
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;
    img.src = this.saved;

    img.onload = () => {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        this.ctx.lineWidth = toolState.lineWidth;
        this.ctx.fillStyle = toolState.fillColor;
        this.ctx.strokeStyle = toolState.strokeColor;
        this.ctx.globalCompositeOperation = 'source-over';

        switch (this.name) {
          case ToolNames.RECT:
            this.ctx.rect(x, y, width as number, height as number);
            break;
          case ToolNames.CIRCLE:
            Tool.drawCircle(this.ctx, x, y, width as number, height as number, isShift);
            break;
          case ToolNames.LINE:
            this.ctx.moveTo(startX as number, startY as number);
            this.ctx.lineTo(x, y);
            break;
        }

        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
      }
    };
  }

  public static draw(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      width,
      height,
      lineWidth,
      fillColor,
      strokeColor,
      type,
      startX,
      startY,
      isShift,
    }: FigureType,
  ) {
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.globalCompositeOperation = 'source-over';

    const colorize = () => {
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
    };
    switch (type) {
      case ToolNames.BRUSH:
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case ToolNames.RECT:
        ctx.rect(x, y, width as number, height as number);
        colorize();
        break;
      case ToolNames.CIRCLE:
        Tool.drawCircle(ctx, x, y, width as number, height as number, isShift);
        colorize();
        break;
      case ToolNames.LINE:
        ctx.moveTo(startX as number, startY as number);
        ctx.lineTo(x, y);
        colorize();
        break;
      case ToolNames.ERASER:
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
    }
  }
}
