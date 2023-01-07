import Tool from './Tool';
import { CanvasType } from '../types/canvas';

export default class Brush extends Tool {
  private mouseDown = false;

  constructor(canvas: CanvasType) {
    super(canvas);
    this.listen();
  }

  listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
  }

  mouseDownHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
  }

  mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
    }
  }

  draw(x: number, y: number) {
    this.ctx?.lineTo(x, y);
    this.ctx?.stroke();
  }
}
