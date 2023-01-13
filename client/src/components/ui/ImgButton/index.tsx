import { FC, HTMLAttributes, ReactNode } from 'react';

import styles from './ImgButton.module.scss';

interface ImgButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  w?: number | string;
  h?: number | string;
  className?: string;
  active?: boolean;
}

const ImgButton: FC<ImgButtonProps> = ({ children, h, w, className, active, ...props }) => {
  return (
    <button
      className={`${styles.imgBtn} ${className ? className : ''} ${active ? styles.active : ''}`}
      style={w || h ? { width: w, height: h } : {}}
      {...props}>
      {children}
    </button>
  );
};

export default ImgButton;
