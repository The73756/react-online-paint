import { FC, ReactNode } from 'react';
import ReactModal from 'react-modal';

import styles from './Modal.module.scss';

interface ModalProps extends ReactModal.Props {
  children: ReactNode;
}

const ModalContentClassNames = {
  base: styles.customModal,
  afterOpen: styles.customModal_afterOpen,
  beforeClose: styles.customModal_beforeClose,
};

const ModalOverlayClassNames = {
  base: styles.customModal__overlay,
  afterOpen: styles.customModal__overlay_afterOpen,
  beforeClose: styles.customModal__overlay_beforeClose,
};

ReactModal.setAppElement('#root');

const Modal: FC<ModalProps> = ({ children, ...props }) => {
  return (
    <ReactModal
      {...props}
      className={ModalContentClassNames}
      overlayClassName={ModalOverlayClassNames}
      closeTimeoutMS={200}>
      {children}
    </ReactModal>
  );
};

export default Modal;
