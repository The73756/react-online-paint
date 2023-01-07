import Toolbar from './components/Toolbar';
import SettingsBar from './components/SettingsBar';
import Canvas from './components/Canvas';

import './scss/main.scss';

function App() {
  return (
    <>
      <Toolbar />
      <SettingsBar />
      <div className="container">
        <Canvas />
      </div>
    </>
  );
}

export default App;
