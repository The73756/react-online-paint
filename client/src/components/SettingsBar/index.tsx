import { FC } from 'react';
import TopBar from '../ui/TopBar';

import styles from './SettingsBar.module.scss';

const SettingsBar: FC = () => {
  return (
    <TopBar>
      <div className={styles.settingBar}>
        <span>Толщина линии</span>
        <input className={styles.settingBar__input} type="number" />
      </div>
    </TopBar>
  );
};

export default SettingsBar;
