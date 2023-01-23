import { FC, useEffect, useState } from 'react';
import canvasState from '../../../store/canvasState';
import { SaveImg } from '../../../assets/images/svg';
import Button from '../Button';
import Modal from '../Modal';

import styles from './SaveButton.module.scss';

interface SaveButtonProps {
  className: string;
}

const SaveButton: FC<SaveButtonProps> = ({ className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState('');

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.code === 'KeyS') {
      e.preventDefault();
      openModal();
    }
  };

  const saveCanvas = () => {
    if (canvasState.canvas) {
      const dataUrl = canvasState.canvas.toDataURL('image/png');
      const currentFilename = filename ? filename : canvasState.sessionId;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = currentFilename + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button className={className} aria-label="Сохранить" title="Сохранить" onClick={openModal}>
        <SaveImg />
      </Button>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <div className={styles.saveModal}>
          <h2>Сохранить</h2>
          <label htmlFor="nameInput" className={styles.saveModal__subtitle}>
            Введите название файла или оставьте пустым для использования названия по умолчанию
          </label>
          <div className={styles.saveModal__inputBlock}>
            <input
              type="text"
              id="nameInput"
              placeholder="Название файла"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className={styles.saveModal__nameInput}
            />
          </div>
          <div className={styles.saveModal__buttonBlock}>
            <Button onClick={saveCanvas} variant="success" className={styles.saveModal__btn}>
              Сохранить
            </Button>
            <Button onClick={closeModal} variant="danger" className={styles.saveModal__btn}>
              Отменить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SaveButton;
