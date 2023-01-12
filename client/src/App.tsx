import Toolbar from './components/Toolbar';
import SettingsBar from './components/SettingsBar';
import Canvas from './components/Canvas';

import './scss/main.scss';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const sessionId = `${(+new Date()).toString(16)}`;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:id"
          element={
            <>
              <Toolbar />
              <SettingsBar />
              <div className="container">
                <Canvas />
              </div>
            </>
          }
        />
        <Route path="*" element={<Navigate to={sessionId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
