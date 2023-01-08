import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Tool {
  public canvas: CanvasType;
  public ctx: CanvasRenderingContext2D | null | undefined;
  public name = ToolNames.EMPTY;

  constructor(canvas: CanvasType) {
    this.canvas = canvas;
    this.ctx = this.canvas?.getContext('2d');
    this.destroyEvents();
  }

  private destroyEvents() {
    if (this.canvas) {
      this.canvas.onmousemove = null;
      this.canvas.onmousedown = null;
      this.canvas.onmouseup = null;
    }
  }
}
