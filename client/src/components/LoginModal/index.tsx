import { FC, FormEvent, useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/buttons/Button';
import { loginUser } from '../../http/userApi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import styles from './LoginModal.module.scss';
import canvasState from '../../store/canvasState';
import usersState from '../../store/usersState';

const LoginModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localUsername, setLocalUsername] = useState('');
  const [isError, setIsError] = useState(false);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const connectHandler = async (e?: FormEvent) => {
    e?.preventDefault();

    if (localUsername) {
      const response = await toast.promise(
        loginUser(localUsername, id),
        {
          loading: 'Загрузка...',
          success: <span>Подключено</span>,
          error: (err) => <span>{err.response.data.message}</span>,
        },
        {
          style: {
            width: '250px',
          },
        },
      );

      canvasState.setUsername(localUsername);
      canvasState.setAuth(true);
      usersState.setUsers(response.users);

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
      onRequestClose={() => {}}
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
          <Button className={styles.loginModalContent__btn} type="submit" variant="success">
            Войти
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
