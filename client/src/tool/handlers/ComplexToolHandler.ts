import Tool from '../main/Tool';
import { FigureType, ToolType } from '../../types/tools';
import toolState from '../../store/toolState';
import { drawSend } from '../../ws/senders';
import { CanvasType } from '../../types/canvas';

export default class ComplexToolHandler extends Tool {
  public mouseDown = false;
  public startX = 0;
  public startY = 0;
  public width = 0;
  public height = 0;

  public setCurrentProps: (() => ToolType) | null = null;
  public localDrawFunc: ((e?: MouseEvent) => void) | null = null;

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

  public mouseUpHandler() {
    this.mouseDown = false;

    if (this.setCurrentProps) {
      const currentProps = this.setCurrentProps();
      const figure: ToolType = {
        ...currentProps,
        lineWidth: toolState.lineWidth,
        strokeColor: toolState.strokeColor,
        fillColor: toolState.fillColor,
      };
      drawSend(figure);
    } else {
      console.error('setCurrentProps is not defined');
    }
  }

  public mouseDownHandler(e: MouseEvent) {
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

      this.localDraw(e);
    }
  }

  public localDraw(e?: MouseEvent) {
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;
    const img = new Image();

    const draw = () => {
      if (this.ctx && this.localDrawFunc) {
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        this.ctx.lineWidth = toolState.lineWidth;
        this.ctx.fillStyle = toolState.fillColor;
        this.ctx.strokeStyle = toolState.strokeColor;

        this.localDrawFunc(e);

        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
      } else {
        console.error({
          ctx: this.ctx,
          localDrawFunc: this.localDrawFunc,
        });
      }
    };

    img.src = this.saved;
    img.onload = draw;
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

    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
  }
}
