import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Home from './pages/Home.jsx';
import Radio from './pages/Radio.jsx';
import Artists from './pages/Artists.jsx';
import Stories from './pages/Stories.jsx';
import Submit from './pages/Submit.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/radio" element={<Radio />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </>
  );
}

export default App;
