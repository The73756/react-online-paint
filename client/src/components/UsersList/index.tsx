import { FC } from 'react';
import UsersListItem from '../ui/UsersListItem';
import Drawer from 'react-modern-drawer';
import styles from './UsersList.module.scss';
import usersState from '../../store/usersState';
import { observer } from 'mobx-react-lite';

interface UsersListProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsersList: FC<UsersListProps> = observer(({ isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} direction="right" className={styles.drawer} size="">
      <div className={styles.usersList}>
        <h2 className={styles.usersList__title}>Пользователи онлайн</h2>
        {usersState.users.map((user, index) => (
          <UsersListItem key={index} username={user.username} />
        ))}
      </div>
    </Drawer>
  );
});

export default UsersList;
