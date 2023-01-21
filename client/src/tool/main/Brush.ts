import { CanvasType } from '../../types/canvas';
import { BrushType, FigureType, ToolNames } from '../../types/tools';
import SimpleToolHandler from '../handlers/SimpleToolHandler';
import canvasState from '../../store/canvasState';

export default class Brush extends SimpleToolHandler {
  constructor(canvas: CanvasType, socket: WebSocket | null, sessionId: string) {
    super(canvas, socket, sessionId);
    this.listen();
    this.name = ToolNames.BRUSH;

    this.setCurrentProps = () => {
      const brushProps: BrushType = {
        type: ToolNames.BRUSH,
        x: this.x,
        y: this.y,
      };
      return brushProps;
    };
  }

  public static draw = (ctx: CanvasRenderingContext2D, figure: FigureType) => {
    const { x, y } = figure as BrushType;

    super.onlineDraw(ctx, figure, () => {
      ctx.lineTo(x * canvasState.scaleFactor, y * canvasState.scaleFactor);
    });
  };
}
