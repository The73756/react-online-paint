import { FC } from 'react';

import styles from './UsersListItem.module.scss';

interface UsersListItemProps {
  username: string;
}

const UsersListItem: FC<UsersListItemProps> = ({ username }) => {
  return (
    <div className={styles.usersListItem}>
      <p className={styles.usersListItem__desc}>{username}</p>
      <p className={styles.usersListItem__desc}>Активен</p>
    </div>
  );
};

export default UsersListItem;
