import { CanvasType } from '../../types/canvas';
import { FigureType, RectType, ToolNames } from '../../types/tools';
import ComplexToolHandler from '../handlers/ComplexToolHandler';
import toolState from '../../store/toolState';

export default class Rect extends ComplexToolHandler {
  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.name = ToolNames.RECT;

    this.setCurrentProps = () => {
      const rectProps: RectType = {
        type: ToolNames.RECT,
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
      };
      return rectProps;
    };

    this.localDrawFunc = () => {
      this.ctx?.rect(this.startX, this.startY, this.width, this.height);
    };
  }

  public static draw(ctx: CanvasRenderingContext2D, figure: FigureType) {
    const drawRect = (ctx: CanvasRenderingContext2D, figure: FigureType) => {
      const { x, y, width, height } = figure as RectType;

      ctx.rect(
        x * toolState.toolScaleFactor,
        y * toolState.toolScaleFactor,
        width * toolState.toolScaleFactor,
        height * toolState.toolScaleFactor,
      );
    };

    super.onlineDraw(ctx, figure, drawRect);
  }
}
