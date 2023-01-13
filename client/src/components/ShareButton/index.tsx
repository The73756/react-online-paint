import { FC } from 'react';
import ImgButton from '../ui/ImgButton';
import { ShareImg } from '../../assets/images/svg';

const ShareButton: FC = () => {
  return (
    <ImgButton>
      Hello <ShareImg />
    </ImgButton>
  );
};

export default ShareButton;
