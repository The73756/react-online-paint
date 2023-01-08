import Rect from './Rect';
import { CanvasType } from '../types/canvas';
import { ToolNames } from '../types/tools';

export default class Circle extends Rect {
  constructor(canvas: CanvasType) {
    super(canvas);
    this.name = ToolNames.CIRCLE;
  }

  public mouseMoveHandler(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;

    if (this.mouseDown) {
      const currentX = e.pageX - target.offsetLeft;
      const currentY = e.pageY - target.offsetTop;
      const width = currentX - this.startX;
      const height = currentY - this.startY;
      const radius = Math.sqrt(width ** 2 + height ** 2);

      this.draw(this.startX, this.startY, radius);
    }
  }

  public draw(x: number, y: number, radius: number) {
    const img = new Image();
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;

    img.src = this.saved as string;
    img.onload = () => {
      this.ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
      this.ctx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      this.ctx?.beginPath();

      this.ctx?.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx?.fill();
      this.ctx?.stroke();
    };
  }
}
