import { FC, HTMLAttributes } from 'react';

import styles from './ColorPicker.module.scss';

interface ColorPickerProps extends HTMLAttributes<HTMLInputElement> {
  className?: string;
}

const ColorPicker: FC<ColorPickerProps> = ({ className, ...props }) => {
  return <input type="color" className={`${styles.colorPicker} ${className}`} {...props} />;
};

export default ColorPicker;
