import Toolbar from '../components/Toolbar';
import SettingsBar from '../components/SettingsBar';
import Canvas from '../components/Canvas';
import LoginModal from '../components/LoginModal';
import { Toaster } from 'react-hot-toast';

const Home = () => {
  return (
    <>
      <Toolbar />
      <SettingsBar />
      <div className="container">
        <Canvas />
      </div>
      <LoginModal />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: 18,
          },
        }}
      />
    </>
  );
};

export default Home;
