import { FC, useState } from 'react';
import canvasState from '../../../store/canvasState';
import { SaveImg } from '../../../assets/images/svg';
import ImgButton from '../ImgButton';
import Modal from '../Modal';

import styles from './SaveButton.module.scss';

interface SaveButtonProps {
  className: string;
}

const SaveButton: FC<SaveButtonProps> = ({ className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveCanvas = () => {
    if (canvasState.canvas) {
      const dataUrl = canvasState.canvas.toDataURL();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = canvasState.sessionId + '.png'; //jpg support
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  return (
    <>
      <ImgButton
        className={className}
        aria-label="Сохранить"
        title="Сохранить"
        onClick={saveCanvas}>
        <SaveImg />
      </ImgButton>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <div className={styles.saveModal}>asdasd</div>
      </Modal>
    </>
  );
};

export default SaveButton;
