import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Calendar } from './pages/Calendar';
import { Clients } from './pages/Clients';
import { Services } from './pages/Services';
import { Appointments } from './pages/Appointments';
import { History } from './pages/History';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AppProvider, useApp } from './context/AppContext';
import './index.css';

const AppContent = () => {
  const { state } = useApp();

  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
