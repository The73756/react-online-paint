import { ChangeEvent, FC, useState } from 'react';
import TopBar from '../ui/TopBar';

import styles from './SettingsBar.module.scss';
import toolState from '../../store/toolState';

const SettingsBar: FC = () => {
  const [value, setValue] = useState(1);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);

    if (inputValue > 50) {
      setValue(50);
    } else if (inputValue < 1) {
      setValue(1);
    } else {
      setValue(inputValue);
    }

    toolState.setLineWidth(value);
  };

  return (
    <TopBar>
      <div className={styles.settingBar}>
        <label htmlFor="lineWidth">Толщина линии</label>
        <input
          id="lineWidth"
          className={styles.settingBar__input}
          onChange={onChange}
          value={value}
          type="number"
          min={1}
          max={50}
        />
      </div>
    </TopBar>
  );
};

export default SettingsBar;
