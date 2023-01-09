import Tool from './Tool';
import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Rect extends Tool {
  public mouseDown = false;
  public startX = 0;
  public startY = 0;
  public saved = '';

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
      const width = currentX - this.startX;
      const height = currentY - this.startY;

      this.draw(this.startX, this.startY, width, height);
    }
  }

  public draw(x: number, y: number, w: number, h: number) {
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
