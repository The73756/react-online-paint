import { FC } from 'react';
import TopBar from '../ui/TopBar';
import ImgButton from '../ui/ImgButton';
import { ReactComponent as Brush } from '../../assets/image/brush.svg';
import { ReactComponent as Circle } from '../../assets/image/circle.svg';
import { ReactComponent as Eraser } from '../../assets/image/eraser.svg';
import { ReactComponent as Line } from '../../assets/image/line.svg';
import { ReactComponent as Rect } from '../../assets/image/rect.svg';
import { ReactComponent as Redo } from '../../assets/image/redo.svg';
import { ReactComponent as Undo } from '../../assets/image/undo.svg';
import { ReactComponent as Save } from '../../assets/image/save.svg';

import styles from './Toolbar.module.scss';

const Toolbar: FC = () => {
  return (
    <TopBar>
      <div className={styles.toolbar}>
        <div className={styles.toolbar__btns}>
          <ImgButton className={styles.toolbar__btn} aria-label="Выбрать кисть" title="Кисть">
            <Brush />
          </ImgButton>
          <ImgButton className={styles.toolbar__btn} aria-label="Нарисовать круг" title="Круг">
            <Circle />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Нарисовать прямоугольник"
            title="Прямоугольник">
            <Rect />
          </ImgButton>
          <ImgButton className={styles.toolbar__btn} aria-label="Выбрать ластик" title="Ластик">
            <Eraser />
          </ImgButton>
          <ImgButton className={styles.toolbar__btn} aria-label="">
            <Line />
          </ImgButton>
          <input
            type="color"
            className={styles.toolbar__colorPicker}
            aria-label="Выбрать цвет"
            title="Изменить цвет"
          />
        </div>
        <div className={`${styles.toolbar__btns} ${styles.toolbar__btns_right}`}>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Отменить предыдущее действие"
            title="Отменить">
            <Undo />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Вернуть предыдущее действие"
            title="Вернуть">
            <Redo />
          </ImgButton>
          <ImgButton className={styles.toolbar__btn} aria-label="Сохранить" title="Сохранить">
            <Save />
          </ImgButton>
        </div>
      </div>
    </TopBar>
  );
};

export default Toolbar;
