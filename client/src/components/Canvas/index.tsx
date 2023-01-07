import { FC } from 'react';

import styles from './Canvas.module.scss';

const Canvas: FC = () => {
  return (
    <div className={styles.canvas}>
      <canvas className={styles.canvas__inner}></canvas>
    </div>
  );
};

export default Canvas;
