import { FC, FormEvent, useEffect, useState } from 'react';
import canvasState from '../../store/canvasState';
import Modal from '../ui/Modal';

import styles from './LoginModal.module.scss';

const LoginModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localUsername, setLocalUsername] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const connectHandler = (e?: FormEvent) => {
    e?.preventDefault();

    if (localUsername) {
      canvasState.setUsername(localUsername);
      canvasState.setAuth(true);

      setIsModalOpen(false);
      setIsError(false);
      setLocalUsername('');
    } else {
      setIsError(true);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={connectHandler}
      contentLabel="Окно для подключения к комнате">
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
