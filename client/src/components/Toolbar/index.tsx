import { ChangeEvent, FC } from 'react';
import TopBar from '../ui/TopBar';
import ImgButton from '../ui/ImgButton';
import { ReactComponent as BrushImg } from '../../assets/image/brush.svg';
import { ReactComponent as CircleImg } from '../../assets/image/circle.svg';
import { ReactComponent as EraserImg } from '../../assets/image/eraser.svg';
import { ReactComponent as LineImg } from '../../assets/image/line.svg';
import { ReactComponent as RectImg } from '../../assets/image/rect.svg';
import { ReactComponent as RedoImg } from '../../assets/image/redo.svg';
import { ReactComponent as UndoImg } from '../../assets/image/undo.svg';
import { ReactComponent as SaveImg } from '../../assets/image/save.svg';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import Rect from '../../Tools/Rect';
import Circle from '../../Tools/Circle';
import Brush from '../../Tools/Brush';
import Eraser from '../../Tools/Eraser';
import Line from '../../Tools/Line';
import { observer } from 'mobx-react-lite';

import styles from './Toolbar.module.scss';
import { ToolNames } from '../../types/tools';
import ColorPicker from '../ui/ColorPicker';

const Toolbar: FC = observer(() => {
  const currentToolName = toolState.currentToolName;
  const { socket, sessionId } = canvasState;

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;

    toolState.setFillColor(color);
  };

  return (
    <TopBar>
      <div className={styles.toolbar}>
        <div className={styles.toolbar__btns}>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Выбрать кисть"
            title="Кисть"
            onClick={() => toolState.setTool(new Brush(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.BRUSH}>
            <BrushImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Нарисовать прямоугольник"
            title="Прямоугольник"
            onClick={() => toolState.setTool(new Rect(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.RECT}>
            <RectImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Нарисовать круг"
            title="Круг"
            onClick={() => toolState.setTool(new Circle(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.CIRCLE}>
            <CircleImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Нарисовать линию"
            title="Линия"
            onClick={() => toolState.setTool(new Line(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.LINE}>
            <LineImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Выбрать ластик"
            title="Ластик"
            onClick={() => toolState.setTool(new Eraser(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.ERASER}>
            <EraserImg />
          </ImgButton>
          <ColorPicker
            onChange={changeColor}
            aria-label="Выбрать цвет заливки"
            title="Цвет заливки"
          />
        </div>
        <div className={`${styles.toolbar__btns} ${styles.toolbar__btns_right}`}>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Отменить предыдущее действие"
            onClick={() => canvasState.undo()}
            title="Отменить">
            <UndoImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Вернуть предыдущее действие"
            onClick={() => canvasState.redo()}
            title="Вернуть">
            <RedoImg />
          </ImgButton>
          <ImgButton className={styles.toolbar__btn} aria-label="Сохранить" title="Сохранить">
            <SaveImg />
          </ImgButton>
        </div>
      </div>
    </TopBar>
  );
});

export default Toolbar;
