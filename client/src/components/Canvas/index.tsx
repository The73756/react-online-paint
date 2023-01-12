import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import { CanvasWSMethods, MessageType } from '../../types/canvas';
import LoginModal from '../LoginModal';
import { ToolNames } from '../../types/tools';
import { Brush, Circle, Eraser, Line, Rect } from '../../Tools';
import { defaultSend } from '../../ws/senders';
import { closeHandler, openHandler } from '../../ws/handlers';
import { getImage, updateImage } from '../../http/imageApi';

import styles from './Canvas.module.scss';

const Canvas: FC = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null) as MutableRefObject<HTMLCanvasElement>;
  const { id } = useParams() as { id: string };
  const { username } = canvasState;

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    document.addEventListener('keypress', keyPressHandler);
    void syncCanvas();

    return () => {
      document.removeEventListener('keypress', keyPressHandler);
    };
  }, []);

  useEffect(() => {
    if (username) {
      const socket = new WebSocket('ws://localhost:5000');
      canvasState.setSocket(socket);
      canvasState.setSessionId(id);
      toolState.setTool(new Brush(canvasRef.current, socket, id));

      socket.addEventListener('open', openHandler);
      socket.addEventListener('message', (mess) => socketMessageHandler(mess));
      socket.addEventListener('close', closeHandler);

      return () => {
        socket.close();
      };
    }
  }, [username]);

  const syncCanvas = async () => {
    try {
      const imageHash = await getImage(id);
      const img = new Image();
      img.src = imageHash;

      img.onload = () => {
        const canvasCtx = canvasRef.current.getContext('2d');

        canvasCtx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };
    } catch (e) {
      console.log(e);
    }
  };

  const socketMessageHandler = (msg: MessageEvent) => {
    const parsedMsg: MessageType = JSON.parse(msg.data);

    switch (parsedMsg.method) {
      case CanvasWSMethods.CONNECT:
        console.log(`user ${parsedMsg.username} connected`);
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
    } else {
      console.log('ctx is undefined');
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
      try {
        await updateImage(id, canvasRef.current.toDataURL());
      } catch (e) {
        console.log(e);
        alert('Ошибка при попытке синхронизации с сервером');
      }
    }
  };

  return (
    <div className={styles.canvas}>
      <canvas
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        className={styles.canvas__inner}
        ref={canvasRef}
        width={1170}
        height={700}
      />
      <LoginModal />
    </div>
  );
});

export default Canvas;
