import { CanvasWSMethods } from '../types/canvas';
import canvasState from '../store/canvasState';


export const defaultSend = (method: CanvasWSMethods) => {
  canvasState.socket?.send(
    JSON.stringify({
      id: canvasState.sessionId,
      username: canvasState.username,
      method: method,
    }),
  );
}