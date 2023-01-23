import { FC } from 'react';

import styles from './UsersListItem.module.scss';

const UsersListItem: FC = () => {
  return (
    <div className={styles.usersListItem}>
      <p className={styles.usersListItem__desc}>Имя пользователя</p>
      <p className={styles.usersListItem__desc}>Активен</p>
    </div>
  );
};

export default UsersListItem;
