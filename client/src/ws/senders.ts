import { CanvasWSMethods, MessageType } from '../types/canvas';
import canvasState from '../store/canvasState';
import { ToolType } from '../types/tools';
import { toast } from 'react-hot-toast';

export const defaultSend = (method: CanvasWSMethods) => {
  if (!canvasState.socket || !canvasState.isAuth) {
    return toast.error('Вы не авторизованы!');
  }

  canvasState.socket.send(
    JSON.stringify({
      id: canvasState.sessionId,
      username: canvasState.username,
      method: method,
    }),
  );
};

export const drawSend = (propsFigure: ToolType) => {
  if (!canvasState.socket || !canvasState.isAuth) {
    return toast.error('Вы не авторизованы!');
  }
  canvasState.socket.send(
    JSON.stringify({
      method: CanvasWSMethods.DRAW,
      id: canvasState.sessionId,
      figure: propsFigure,
    } as MessageType),
  );
};
