import { ChangeEvent, FC } from 'react';
import { observer } from 'mobx-react-lite';
import TopBar from '../ui/TopBar';
import Button from '../ui/Button';
import ColorPicker from '../ui/ColorPicker';
import { Brush, Circle, Eraser, Line, Rect } from '../../tool';
import { ToolNames } from '../../types/tools';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import {
  BrushImg,
  CircleImg,
  ClearImg,
  EraserImg,
  LineImg,
  RectImg,
  RedoImg,
  UndoImg,
} from '../../assets/images/svg';

import styles from './Toolbar.module.scss';
import SaveButton from '../ui/SaveButton';

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
          <Button
            className={styles.toolbar__btn}
            aria-label="Выбрать кисть"
            title="Кисть"
            onClick={() => toolState.setTool(new Brush(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.BRUSH}>
            <BrushImg />
          </Button>
          <Button
            className={styles.toolbar__btn}
            aria-label="Нарисовать прямоугольник"
            title="Прямоугольник"
            onClick={() => toolState.setTool(new Rect(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.RECT}>
            <RectImg />
          </Button>
          <Button
            className={styles.toolbar__btn}
            aria-label="Нарисовать круг"
            title="Круг"
            onClick={() => toolState.setTool(new Circle(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.CIRCLE}>
            <CircleImg />
          </Button>
          <Button
            className={styles.toolbar__btn}
            aria-label="Нарисовать линию"
            title="Линия"
            onClick={() => toolState.setTool(new Line(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.LINE}>
            <LineImg />
          </Button>
          <Button
            className={styles.toolbar__btn}
            aria-label="Выбрать ластик"
            title="Ластик"
            onClick={() => toolState.setTool(new Eraser(canvasState.canvas, socket, sessionId))}
            active={currentToolName === ToolNames.ERASER}>
            <EraserImg />
          </Button>
          <ColorPicker
            onChange={changeColor}
            aria-label="Выбрать цвет заливки"
            title="Цвет заливки"
          />
        </div>
        <div className={styles.toolbar__btns}>
          <Button
            className={styles.toolbar__btn}
            aria-label="Отменить предыдущее действие"
            onClick={() => canvasState.requestUndo()}
            title="Отменить">
            <UndoImg />
          </Button>
          <Button
            className={styles.toolbar__btn}
            aria-label="Вернуть предыдущее действие"
            onClick={() => canvasState.requestRedo()}
            title="Вернуть">
            <RedoImg />
          </Button>
          <Button
            className={styles.toolbar__btn}
            aria-label="Очистить холст"
            onClick={() => canvasState.requestClear()}
            title="Очистить">
            <ClearImg />
          </Button>
          <SaveButton className={styles.toolbar__btn} />
        </div>
      </div>
    </TopBar>
  );
});

export default Toolbar;
