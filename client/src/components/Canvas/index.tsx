import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import { CanvasWSMethods, MessageType } from '../../types/canvas';
import { ToolNames } from '../../types/tools';
import { Brush, Circle, Eraser, Line, Rect } from '../../tool';
import { defaultSend } from '../../ws/senders';
import { closeHandler, disconnectHandler, openHandler } from '../../ws/handlers';
import { getImage, updateImage } from '../../http/imageApi';
import Loader from '../ui/Loader';
import { toast, Toaster } from 'react-hot-toast';

import styles from './Canvas.module.scss';

const Canvas: FC = observer(() => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null) as MutableRefObject<HTMLCanvasElement>;
  const { id } = useParams() as { id: string };
  const { username } = canvasState;

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    void syncCanvas();
    document.addEventListener('keypress', keyPressHandler);

    return () => {
      document.removeEventListener('keypress', keyPressHandler);
    };
  }, []);

  useEffect(() => {
    if (username) {
      const socket = new WebSocket(process.env.REACT_APP_WS_URL as string);
      canvasState.setSocket(socket);
      canvasState.setSessionId(id);
      toolState.setTool(new Brush(canvasRef.current, socket, id));

      socket.addEventListener('open', openHandler);
      socket.addEventListener('message', socketMessageHandler);
      socket.addEventListener('close', closeHandler);
      window.addEventListener('beforeunload', disconnectHandler);

      return () => {
        socket.removeEventListener('open', openHandler);
        socket.removeEventListener('message', socketMessageHandler);
        socket.removeEventListener('close', closeHandler);
        window.removeEventListener('beforeunload', disconnectHandler);
      };
    }
  }, [username]);

  const syncCanvas = async () => {
    setIsImageLoading(true);
    try {
      const imageHash = await getImage(id);
      canvasState.rewriteCanvas(canvasRef.current, imageHash);
    } catch (e) {
      console.log(e);
      toast.error('Произошла ошибка при синхронизации изображения!');
    } finally {
      setIsImageLoading(false);
    }
  };

  const socketMessageHandler = (msg: MessageEvent) => {
    const parsedMsg: MessageType = JSON.parse(msg.data);

    switch (parsedMsg.method) {
      case CanvasWSMethods.CONNECT:
        const string =
          parsedMsg.username === canvasState.username
            ? 'Подключено'
            : `Пользователь ${parsedMsg.username} подключился`;
        toast.success(string);
        break;
      case CanvasWSMethods.DRAW:
        drawHandler(parsedMsg);
        break;
      case CanvasWSMethods.RELEASE_FIGURE:
        canvasState.addUndo(canvasRef.current.toDataURL());
        break;
      case CanvasWSMethods.UNDO:
        canvasState.undo();
        break;
      case CanvasWSMethods.REDO:
        canvasState.redo();
        break;
      case CanvasWSMethods.CLEAR:
        canvasState.clearCanvas();
        break;
      case CanvasWSMethods.DISCONNECT:
        toast.error(`Пользователь ${parsedMsg.username} отключился`);
    }
  };

  const drawHandler = (msg: MessageType) => {
    const figure = msg.figure;
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      switch (figure.type) {
        case ToolNames.BRUSH:
          Brush.draw(ctx, figure);
          break;
        case ToolNames.RECT:
          Rect.draw(ctx, figure);
          break;
        case ToolNames.CIRCLE:
          Circle.draw(ctx, figure);
          break;
        case ToolNames.LINE:
          Line.draw(ctx, figure);
          break;
        case ToolNames.ERASER:
          Eraser.draw(ctx, figure);
          break;
        case ToolNames.EMPTY:
          ctx.beginPath();
          break;
      }
    }
  };

  const keyPressHandler = (e: KeyboardEvent) => {
    switch (e.ctrlKey && e.code) {
      case 'KeyZ':
        canvasState.requestUndo();
        break;
      case 'KeyY':
        canvasState.requestRedo();
        break;
    }
  };

  const mouseDownHandler = () => {
    defaultSend(CanvasWSMethods.RELEASE_FIGURE);
  };

  const mouseUpHandler = async () => {
    if (canvasRef.current) {
      await updateImage(id, canvasRef.current.toDataURL());
    }
  };

  return (
    <div className={styles.canvas}>
      <Loader isLoading={isImageLoading} className={styles.loader} />
      <canvas
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        className={styles.canvas__inner}
        ref={canvasRef}
        width={1170}
        height={700}
        tabIndex={1}
      />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: 18,
          },
        }}
      />
    </div>
  );
});

export default Canvas;
