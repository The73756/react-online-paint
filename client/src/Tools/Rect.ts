import Tool from './Tool';
import { CanvasType, CanvasWSMethods, FigureType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Rect extends Tool {
  public mouseDown = false;
  public startX = 0;
  public startY = 0;
  public saved = '';
  public width = 0;
  public height = 0;

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

  private mouseUpHandler() {
    this.mouseDown = false;

    this.socket?.send(
      JSON.stringify({
        method: CanvasWSMethods.DRAW,
        id: this.sessionId,
        figure: {
          type: this.name,
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
          strokeWidth: this.ctx?.lineWidth,
          strokeColor: this.ctx?.strokeStyle as string,
          fillColor: this.ctx?.fillStyle as string,
        },
      }),
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
      this.height = currentY - this.startY;

      this.localDraw(this.startX, this.startY, this.width, this.height);
    }
  }

  public static draw(
    ctx: CanvasRenderingContext2D,
    { x, y, width, height, lineWidth, fillColor, strokeColor }: FigureType,
  ) {
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
  }

  public localDraw(x: number, y: number, w: number, h: number) {
    const img = new Image();
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;

    img.src = this.saved;
    img.onload = () => {
      this.ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
      this.ctx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      this.ctx?.beginPath();

      this.ctx?.rect(x, y, w, h);
      this.ctx?.fill();
      this.ctx?.stroke();
    };
  }
}
