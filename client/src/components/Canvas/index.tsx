import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import Brush from '../../Tools/Brush';
import Modal from '../ui/Modal';

import styles from './Canvas.module.scss';

const Canvas: FC = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [username, setUsername] = useState('');

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

  const connectHandler = () => {
    if (username) {
      canvasState.setUsername(username);
      setIsModalOpen(false);
    } else {
      alert('Имя не может быть пустым!');
    }
  };

  const handleModalClose = () => {
    if (username) {
      setIsModalOpen(false);
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
      <Modal opened={isModalOpen} onClose={handleModalClose}>
        <div className={styles.modal}>
          <h2 className={styles.modal__title}>Введите свое имя</h2>
          <input
            placeholder="Ваше имя"
            type="text"
            className={styles.modal__input}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button className={styles.modal__btn} onClick={connectHandler}>
            Войти
          </button>
        </div>
      </Modal>
    </div>
  );
});

export default Canvas;
