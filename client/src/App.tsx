import './scss/main.scss';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

const sessionId = `${(+new Date()).toString(16)}`;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<Home />} />
        <Route path="*" element={<Navigate to={sessionId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
