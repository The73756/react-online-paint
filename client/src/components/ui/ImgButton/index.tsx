import { FC, HTMLAttributes, ReactNode } from 'react';

import styles from './ImgButton.module.scss';

interface ImgButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  w?: number | string;
  h?: number | string;
  className?: string;
  onClick?: () => void;
}

const ImgButton: FC<ImgButtonProps> = ({ children, h, w, className, onClick, ...props }) => {
  const btnProps = {
    className: `${styles.imgBtn} ${className ? className : ''}`,
    style: w || h ? { width: w, height: h } : {},
    ...props,
  };
  return (
    <button {...btnProps} onClick={onClick}>
      {children}
    </button>
  );
};

export default ImgButton;
