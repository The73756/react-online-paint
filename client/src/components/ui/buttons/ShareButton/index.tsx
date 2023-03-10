import { FC, useState } from 'react';
import canvasState from '../../../../store/canvasState';
import { ShareImg } from '../../../../assets/images/svg';
import { Tooltip } from 'react-tooltip';
import Modal from '../../Modal';
import Button from '../Button';

import styles from './ShareButton.module.scss';

const ShareButton: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIdCopied, setIsIdCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { sessionId } = canvasState;
  const link = `${window.location.origin}/${sessionId}`;

  const copyId = async () => {
    await navigator.clipboard.writeText(sessionId);
    setIsIdCopied(true);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setIsLinkCopied(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsIdCopied(false);
    setIsLinkCopied(false);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <span className={styles.shareButton}>
          Поделиться <ShareImg className={styles.shareButton__img} />
        </span>
      </Button>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <div className={styles.shareModal}>
          <h2 className={styles.shareModal__title}>Поделиться </h2>
          <p className={styles.shareModal__group}>
            Что бы друг подключился отправьте ему этот код:
            <button id="tooltip1" className={styles.shareModal__link} onClick={copyId}>
              {sessionId}
            </button>
          </p>
          <Tooltip
            anchorId="tooltip1"
            content={isIdCopied ? 'Скопировано' : 'Нажмите что бы скопировать'}
          />
          <p className={styles.shareModal__group}>
            Или попросите его перейти по этой ссылке:
            <button id="tooltip2" className={styles.shareModal__link} onClick={copyLink}>
              {link}
            </button>
          </p>
          <Tooltip
            anchorId="tooltip2"
            content={isLinkCopied ? 'Скопировано' : 'Нажмите что бы скопировать'}
          />
          <Button
            variant="danger"
            className={styles.shareModal__btn}
            type="submit"
            onClick={closeModal}>
            Отмена
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShareButton;
