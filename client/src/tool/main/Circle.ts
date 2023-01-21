import ComplexToolHandler from '../handlers/ComplexToolHandler';
import { CanvasType } from '../../types/canvas';
import { CircleType, FigureType, ToolNames } from '../../types/tools';
import toolState from '../../store/toolState';

export default class Circle extends ComplexToolHandler {
  private centerX = 0;
  private centerY = 0;
  private radiusX = 0;
  private radiusY = 0;

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.name = ToolNames.CIRCLE;
    this.name = ToolNames.CIRCLE;

    this.setCurrentProps = () => {
      const circleProps: CircleType = {
        type: ToolNames.CIRCLE,
        x: this.centerX,
        y: this.centerY,
        radiusX: this.radiusX,
        radiusY: this.radiusY,
      };
      return circleProps;
    };

    this.localDrawFunc = (e) => {
      this.drawCircle(this.startX, this.startY, e as MouseEvent);
    };
  }

  private drawCircle(x: number, y: number, e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;
    const currentWidth = e.pageX - target.offsetLeft;
    const currentHeight = e.pageY - target.offsetTop;

    this.radiusX = Math.abs((currentWidth - x) * 0.5);
    this.radiusY = e.shiftKey ? this.radiusX : Math.abs((currentHeight - y) * 0.5);

    if (currentWidth >= x) {
      this.centerX = x + this.radiusX;
    } else {
      this.centerX = x - this.radiusX;
    }

    if (currentHeight >= y) {
      this.centerY = y + this.radiusY;
    } else {
      this.centerY = y - this.radiusY;
    }

    this.ctx?.beginPath();
    this.ctx?.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
  }

  public static draw(ctx: CanvasRenderingContext2D, figure: FigureType) {
    const drawCircle = (ctx: CanvasRenderingContext2D, figure: FigureType) => {
      const { x, y, radiusX, radiusY } = figure as CircleType;

      ctx.ellipse(
        x * toolState.toolScaleFactor,
        y * toolState.toolScaleFactor,
        radiusX * toolState.toolScaleFactor,
        radiusY * toolState.toolScaleFactor,
        0,
        0,
        2 * Math.PI,
      );
    };

    super.onlineDraw(ctx, figure, drawCircle);
  }
}
