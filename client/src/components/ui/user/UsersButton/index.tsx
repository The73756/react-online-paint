import { FC, useState } from 'react';
import Button from '../../buttons/Button';
import { UserImg } from '../../../../assets/images/svg';
import UsersList from '../UsersList';

import styles from './UsersButton.module.scss';

const UsersButton: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsDrawerOpen(true)}>
        <span className={styles.usersButton}>
          Пользователи <UserImg className={styles.usersButton__img} />
        </span>
      </Button>
      <UsersList onClose={() => setIsDrawerOpen(false)} isOpen={isDrawerOpen} />
    </div>
  );
};

export default UsersButton;
