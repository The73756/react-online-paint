import { CanvasType } from '../../types/canvas';
import { EraserType, FigureType, ToolNames } from '../../types/tools';
import SimpleToolHandler from '../handlers/SimpleToolHandler';
import CanvasState from '../../store/canvasState';

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
  }

  public static draw = (ctx: CanvasRenderingContext2D, figure: FigureType) => {
    const { x, y } = figure as EraserType;
    ctx.globalCompositeOperation = 'destination-out';

    super.onlineDraw(ctx, figure, () => {
      ctx.lineTo(x * CanvasState.scaleFactor, y * CanvasState.scaleFactor);
    });

    ctx.globalCompositeOperation = 'source-over';
  };
}
