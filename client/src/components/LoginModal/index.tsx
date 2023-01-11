import { FC, FormEvent, useState } from 'react';
import Modal from 'react-modal';
import canvasState from '../../store/canvasState';

import styles from './LoginModal.module.scss';

const LoginModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [localUsername, setLocalUsername] = useState('');
  const [isError, setIsError] = useState(false);

  const ModalContentClassNames = {
    base: styles.loginModal,
    afterOpen: styles.loginModal_afterOpen,
    beforeClose: styles.loginModal_beforeClose,
  };

  const ModalOverlayClassNames = {
    base: styles.loginModal__overlay,
    afterOpen: styles.loginModal__overlay_afterOpen,
    beforeClose: styles.loginModal__overlay_beforeClose,
  };

  Modal.setAppElement('#root');

  const connectHandler = (e?: FormEvent) => {
    e?.preventDefault();

    if (localUsername) {
      canvasState.setUsername(localUsername);
      setIsModalOpen(false);
      setIsError(false);
    } else {
      setIsError(true);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={connectHandler}
      contentLabel="Введите свое имя"
      className={ModalContentClassNames}
      overlayClassName={ModalOverlayClassNames}
      closeTimeoutMS={200}>
      <div className={styles.loginModalContent}>
        <h2 className={styles.loginModalContent__title}>Введите свое имя</h2>
        <form onSubmit={connectHandler}>
          <input
            placeholder="Ваше имя"
            type="text"
            className={`${styles.loginModalContent__input} ${isError ? styles.error : ''} `}
            value={localUsername}
            onChange={(e) => {
              setLocalUsername(e.target.value);
            }}
          />
          <button className={styles.loginModalContent__btn} type="submit">
            Войти
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
