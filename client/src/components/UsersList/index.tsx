import { FC } from 'react';
import UsersListItem from '../ui/UsersListItem';
import Drawer from 'react-modern-drawer';
import styles from './UsersList.module.scss';

interface UsersListProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsersList: FC<UsersListProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} direction="right" className={styles.drawer} size="">
      <div className={styles.usersList}>
        <h2 className={styles.usersList__title}>Пользователи онлайн</h2>
        {[...Array(10)].map((_, index) => (
          <UsersListItem key={index} />
        ))}
      </div>
    </Drawer>
  );
};

export default UsersList;
