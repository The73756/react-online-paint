import { Layout } from './Layout';
import { useMount } from './hooks/useMount';
import Portal from './Portal';
import { ModalType } from './types';
import { FC, ReactNode } from 'react';

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ opened, onClose, children }) => {
  const { mounted } = useMount({ opened, animationTime: ModalType.ANIMATION_TIME });

  if (!mounted) {
    return null;
  }

  return (
    <Portal>
      <Layout onClose={onClose} opened={opened}>
        {children}
      </Layout>
    </Portal>
  );
};

export default Modal;
