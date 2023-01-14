import { FC, HTMLAttributes, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './Loader.module.scss';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
}

const classNames = {
  enter: styles.loaderWrapper_enter,
  enterActive: styles.loaderWrapper_enterActive,
  exit: styles.loaderWrapper_exit,
  exitActive: styles.loaderWrapper_exitActive,
};

const Loader: FC<LoaderProps> = ({ isLoading, className }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isLoading}
      timeout={600}
      unmountOnExit
      classNames={classNames}>
      <div
        className={`${styles.loaderWrapper} ${className ? className : ''}`}
        ref={nodeRef}
        title="Загрузка..."
        aria-label="Загрузка...">
        <div className={styles.loader}>
          {[...new Array(15)].map((_, index) => {
            return <span className={styles.loader__item} key={index} />;
          })}
        </div>
      </div>
    </CSSTransition>
  );
};

export default Loader;
