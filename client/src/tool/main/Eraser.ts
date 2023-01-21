import { CanvasType } from '../../types/canvas';
import { EraserType, FigureType, ToolNames } from '../../types/tools';
import SimpleToolHandler from '../handlers/SimpleToolHandler';
import toolState from '../../store/toolState';

export default class Eraser extends SimpleToolHandler {
  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.listen();
    this.name = ToolNames.ERASER;

    this.setCurrentProps = () => {
      const brushProps: EraserType = {
        type: ToolNames.ERASER,
        x: this.x,
        y: this.y,
      };
      return brushProps;
    };

    this.localDrawFunc = () => {
      if (this.ctx) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineTo(this.x, this.y);
        this.ctx.stroke();
        this.ctx.globalCompositeOperation = 'source-over';
      }
    };
  }

  public static draw = (ctx: CanvasRenderingContext2D, figure: FigureType) => {
    const { x, y } = figure as EraserType;
    ctx.globalCompositeOperation = 'destination-out';

    super.onlineDraw(ctx, figure, () => {
      ctx.lineTo(x * toolState.toolScaleFactor, y * toolState.toolScaleFactor);
    });

    ctx.globalCompositeOperation = 'source-over';
  };
}
