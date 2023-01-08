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

    if (canvasRef.current) {
      toolState.setTool(new Brush(canvasRef.current));
    }
  }, []);

  return (
    <div className={styles.canvas}>
      <canvas className={styles.canvas__inner} ref={canvasRef} width={1170} height={700}></canvas>
    </div>
  );
});

export default Canvas;
