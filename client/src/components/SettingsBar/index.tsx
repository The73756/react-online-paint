import { ChangeEvent, FC, useState } from 'react';
import TopBar from '../ui/TopBar';
import ColorPicker from '../ui/ColorPicker';
import ShareButton from '../ui/ShareButton';
import toolState from '../../store/toolState';
import Button from '../ui/Button';

import styles from './SettingsBar.module.scss';
import UsersList from '../UsersList';

const SettingsBar: FC = () => {
  const [value, setValue] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    toolState.setStrokeColor(e.target.value);
  };

  return (
    <TopBar>
      <div className={styles.settingBar}>
        <div className={styles.settingBar__group}>
          <label htmlFor="lineWidth">Толщина линии:</label>
          <input
            id="lineWidth"
            className={styles.settingBar__input}
            onChange={onChange}
            value={value}
            type="number"
            min={1}
            max={50}
          />
          <label htmlFor="lineColor">Цвет линии:</label>
          <ColorPicker
            id="lineColor"
            onChange={changeColor}
            aria-label="Выбрать цвет линии"
            title="Цвет линии"
          />
        </div>
        <div className={styles.settingBar__group}>
          <ShareButton />
          <Button onClick={() => setIsDrawerOpen(true)}>Пользователи</Button>
        </div>
      </div>
      <UsersList onClose={() => setIsDrawerOpen(false)} isOpen={isDrawerOpen} />
    </TopBar>
  );
};

export default SettingsBar;
