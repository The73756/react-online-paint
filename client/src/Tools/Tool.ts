import { CanvasType } from '../types/canvas';

export default class Tool {
  public canvas: CanvasType;
  public ctx: CanvasRenderingContext2D | null | undefined;

  constructor(canvas: CanvasType) {
    this.canvas = canvas;
    this.ctx = this.canvas?.getContext('2d');
    this.destroyEvents();
  }

  public destroyEvents() {
    if (this.canvas) {
      this.canvas.onmousemove = null;
      this.canvas.onmousedown = null;
      this.canvas.onmouseup = null;
    }
  }
}
