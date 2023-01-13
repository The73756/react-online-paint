import { ChangeEvent, FC } from 'react';
import { observer } from 'mobx-react-lite';
import TopBar from '../ui/TopBar';
import ImgButton from '../ui/ImgButton';
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
  SaveImg,
  UndoImg,
} from '../../assets/images/svg';

import styles from './Toolbar.module.scss';

const Toolbar: FC = observer(() => {
  const currentToolName = toolState.currentToolName;
  const { socket, sessionId } = canvasState;

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;

    toolState.setFillColor(color);
  };

  const saveCanvas = () => {
    if (canvasState.canvas) {
      const dataUrl = canvasState.canvas.toDataURL();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = canvasState.sessionId + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
        <div className={styles.toolbar__btns}>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Отменить предыдущее действие"
            onClick={() => canvasState.requestUndo()}
            title="Отменить">
            <UndoImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Вернуть предыдущее действие"
            onClick={() => canvasState.requestRedo()}
            title="Вернуть">
            <RedoImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Очистить холст"
            onClick={() => canvasState.requestClear()}
            title="Очистить">
            <ClearImg />
          </ImgButton>
          <ImgButton
            className={styles.toolbar__btn}
            aria-label="Сохранить"
            title="Сохранить"
            onClick={saveCanvas}>
            <SaveImg />
          </ImgButton>
        </div>
      </div>
    </TopBar>
  );
});

export default Toolbar;
