import ComplexToolHandler from '../handlers/ComplexToolHandler';
import { CanvasType } from '../../types/canvas';
import { FigureType, LineType, ToolNames } from '../../types/tools';

export default class Line extends ComplexToolHandler {
  private currentX = 0;
  private currentY = 0;

  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.name = ToolNames.LINE;

    this.setCurrentProps = () => {
      const rectProps: LineType = {
        type: ToolNames.LINE,
        x: this.currentX,
        y: this.currentY,
        startX: this.startX,
        startY: this.startY,
      };
      return rectProps;
    };

    this.localDrawFunc = (e) => {
      this.drawLine(e as MouseEvent);
    };
  }

  private drawLine(e: MouseEvent) {
    const target = e.target as HTMLCanvasElement;
    this.currentX = e.pageX - target.offsetLeft;
    this.currentY = e.pageY - target.offsetTop;

    this.ctx?.moveTo(this.startX as number, this.startY as number);
    this.ctx?.lineTo(this.currentX, this.currentY);
  }

  public static draw(ctx: CanvasRenderingContext2D, figure: FigureType) {
    const drawLine = (ctx: CanvasRenderingContext2D, figure: FigureType) => {
      const { x, y, startX, startY } = figure as LineType;

      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    };

    super.onlineDraw(ctx, figure, drawLine);
  }
}
