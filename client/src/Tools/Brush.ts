import Tool from './Tool';
import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Brush extends Tool {
  private mouseDown = false;

  constructor(canvas: CanvasType) {
    super(canvas);
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

  private mouseUpHandler() {
    this.mouseDown = false;
  }

  private mouseDownHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  private mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
    }
  }

  public draw(x: number, y: number, w?: number, h?: number) {
    this.ctx?.lineTo(x, y);
    this.ctx?.stroke();
  }
}
