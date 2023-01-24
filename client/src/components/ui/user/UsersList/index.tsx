import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import Drawer from 'react-modern-drawer';
import usersState from '../../../../store/usersState';
import UsersListItem from '../UsersListItem';

import styles from './UsersList.module.scss';

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
