import { FC, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import Brush from '../../Tools/Brush';

import styles from './Canvas.module.scss';

const Canvas: FC = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    document.addEventListener('keypress', keyPressHandler);

    if (canvasRef.current) {
      toolState.setTool(new Brush(canvasRef.current));
    }

    return () => {
      document.removeEventListener('keypress', keyPressHandler);
    };
  }, []);

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
        height={700}></canvas>
    </div>
  );
});

export default Canvas;
