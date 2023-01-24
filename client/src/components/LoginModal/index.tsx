import { FC, FormEvent, useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/buttons/Button';
import { loginUser } from '../../http/userApi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import canvasState from '../../store/canvasState';
import usersState from '../../store/usersState';

import styles from './LoginModal.module.scss';

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
      const res = await loginUser(localUsername, id);
      if (res.isLogin) {
        canvasState.setUsername(localUsername);
        canvasState.setAuth(true);
        usersState.setUsers(res.users);
        toast.success('Подключено');
        console.log(res.users);
        setIsModalOpen(false);
        setIsError(false);
        setLocalUsername('');
      } else {
        toast.error(res.message);
      }
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
