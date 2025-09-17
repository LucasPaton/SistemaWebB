import { Routes, Route } from 'react-router-dom';
import ClientesList from './pages/ClientesList';
import ClienteDetalhes from './pages/ClienteDetalhes';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientesList />} />
      <Route path="/cliente/:id" element={<ClienteDetalhes />} />
    </Routes>
  );
};

export default App;
