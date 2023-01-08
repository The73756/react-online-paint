import styles from './ColorPicker.module.scss';
import { FC, HTMLAttributes } from 'react';

interface ColorPickerProps extends HTMLAttributes<HTMLInputElement> {
  className?: string;
}

const ColorPicker: FC<ColorPickerProps> = ({ className, ...props }) => {
  const inputClassName = `${styles.colorPicker} ${className}`;

  return <input type="color" className={inputClassName} {...props} />;
};

export default ColorPicker;
