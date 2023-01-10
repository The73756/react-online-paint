import { FC, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import Brush from '../../Tools/Brush';
import { useParams } from 'react-router-dom';
import { CanvasWSMethods, MessageType } from '../../types/canvas';
import LoginModal from '../LoginModal';
import { ToolNames } from '../../types/tools';
import Rect from '../../Tools/Rect';

import styles from './Canvas.module.scss';

const Canvas: FC = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { username } = canvasState;
  const { id } = useParams() as { id: string };

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    document.addEventListener('keypress', keyPressHandler);

    return () => {
      document.removeEventListener('keypress', keyPressHandler);
    };
  }, []);

  useEffect(() => {
    if (username) {
      const socket = new WebSocket('ws://localhost:5000');
      canvasState.setSocket(socket);
      canvasState.sessionId = id;
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
        }
      };
    }
  }, [username]);

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
      canvasState.undo();
    }

    if (e.ctrlKey && e.code === 'KeyY') {
      canvasState.redo();
    }
  };

  const mouseDownHandler = () => {
    if (canvasRef.current) {
      canvasState.addUndo(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className={styles.canvas}>
      <canvas
        onMouseDown={mouseDownHandler}
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
