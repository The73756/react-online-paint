import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import canvasState from '../../store/canvasState';
import CanvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import { CanvasWSMethods, MessageType } from '../../types/canvas';
import LoginModal from '../LoginModal';
import { ToolNames } from '../../types/tools';
import { Brush, Circle, Eraser, Line, Rect } from '../../Tools';

import styles from './Canvas.module.scss';

const Canvas: FC = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null) as MutableRefObject<HTMLCanvasElement>;
  const { username } = canvasState;
  const { id } = useParams() as { id: string };

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    document.addEventListener('keypress', keyPressHandler);
    syncCanvas();

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

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id,
            username,
            method: CanvasWSMethods.CONNECT,
          }),
        );
      };

      socket.onmessage = (mess) => {
        const msg: MessageType = JSON.parse(mess.data);

        switch (msg.method) {
          case CanvasWSMethods.CONNECT:
            console.log(`user ${msg.username} connected`);
            break;
          case CanvasWSMethods.DRAW:
            drawHandler(msg);
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

      socket.onclose = () => {
        alert('Соединение с сервером разорвано');
      };
    }
  }, [username]);

  const syncCanvas = async () => {
    try {
      const canvasData = await axios.get(`http://localhost:5000/image?id=${id}`);
      const img = new Image();
      img.src = canvasData.data;

      img.onload = () => {
        const canvasCtx = canvasRef.current.getContext('2d');

        canvasCtx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };
    } catch (e) {
      console.log(e);
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
    if (e.ctrlKey && e.code === 'KeyZ') {
      canvasState.requestUndo();
    }

    if (e.ctrlKey && e.code === 'KeyY') {
      canvasState.requestRedo();
    }
  };

  const mouseDownHandler = () => {
    CanvasState.socket?.send(
      JSON.stringify({
        id,
        username,
        method: CanvasWSMethods.RELEASE_FIGURE,
      }),
    );
  };

  const mouseUpHandler = async () => {
    if (canvasRef.current) {
      try {
        await axios.post(`http://localhost:5000/image/?id=${id}`, {
          img: canvasRef.current.toDataURL(),
        });
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
