import Brush from './Brush';
import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Eraser extends Brush {
  constructor(canvas: CanvasType) {
    super(canvas);
    this.name = ToolNames.ERASER;
  }

  public draw(x: number, y: number) {
    if (this.ctx) {
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
}
