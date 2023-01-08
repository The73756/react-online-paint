import Rect from './Rect';
import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Line extends Rect {
  constructor(canvas: CanvasType) {
    super(canvas);
    this.name = ToolNames.LINE;
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
    }
  }

  public draw(x: number, y: number) {
    const img = new Image();
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;

    img.src = this.saved as string;
    img.onload = () => {
      this.ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
      this.ctx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      this.ctx?.beginPath();

      this.ctx?.moveTo(this.startX, this.startY);
      this.ctx?.lineTo(x, y);
      this.ctx?.stroke();
    };
  }
}
