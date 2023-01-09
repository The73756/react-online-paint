import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ModalType } from '../types';

import styles from './Modal.module.scss';
import animationStyles from './ModalAnimation.module.scss';

interface LayoutProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
}

const overlayAnimation = {
  enter: animationStyles.overlayEnter,
  enterActive: animationStyles.overlayEnterActive,
  exit: animationStyles.overlayExit,
  exitActive: animationStyles.overlayExitActive,
};

const contentAnimation = {
  enter: animationStyles.contentEnter,
  enterActive: animationStyles.contentEnterActive,
  exit: animationStyles.contentExit,
  exitActive: animationStyles.contentExitActive,
};

export const Layout: FC<LayoutProps> = ({ onClose, children, opened }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [animationIn, setAnimationIn] = useState(false);

  const keydownHandler = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        onClose();
        break;
      default:
    }
  };

  useEffect(() => {
    setAnimationIn(opened);
  }, [opened]);

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => document.removeEventListener('keydown', keydownHandler);
  }, []);

  return (
    <div className={styles.container}>
      <CSSTransition
        in={animationIn}
        nodeRef={overlayRef}
        timeout={ModalType.ANIMATION_TIME}
        mountOnEnter
        unmountOnExit
        classNames={overlayAnimation}>
        <div ref={overlayRef} className={styles.overlay} onClick={onClose} />
      </CSSTransition>
      <CSSTransition
        in={animationIn}
        nodeRef={contentRef}
        timeout={ModalType.ANIMATION_TIME}
        mountOnEnter
        unmountOnExit
        classNames={contentAnimation}>
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </CSSTransition>
    </div>
  );
};
