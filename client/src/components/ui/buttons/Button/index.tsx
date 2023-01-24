import { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode } from 'react';

import styles from './Button.module.scss';

interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: ReactNode;
  w?: number | string;
  h?: number | string;
  className?: string;
  active?: boolean;
  variant?: 'default' | 'danger' | 'success';
}

const Button: FC<ButtonProps> = ({
  children,
  h,
  w,
  className,
  active,
  variant = 'default',
  ...props
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}  ${active ? styles.active : ''} ${
        className ? className : ''
      } `}
      style={w || h ? { width: w, height: h } : {}}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
