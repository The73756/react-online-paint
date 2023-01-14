import Toolbar from '../components/Toolbar';
import SettingsBar from '../components/SettingsBar';
import Canvas from '../components/Canvas';
import LoginModal from '../components/LoginModal';

const Home = () => {
  return (
    <>
      <Toolbar />
      <SettingsBar />
      <div className="container">
        <Canvas />
      </div>
      <LoginModal />
    </>
  );
};

export default Home;
