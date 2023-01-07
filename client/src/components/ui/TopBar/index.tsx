import { FC, ReactNode } from 'react';
import styles from './TopBar.module.scss';

interface TopBarProps {
  children: ReactNode;
}

const TopBar: FC<TopBarProps> = ({ children }) => {
  return (
    <div className={styles.topBar}>
      <span className={`container ${styles.topBar__inner}`}>{children}</span>
    </div>
  );
};

export default TopBar;
