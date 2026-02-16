
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './src/views/Dashboard';
import Candidates from './src/views/Candidates';
import AIInsights from './src/views/AIInsights';
import Clients from './src/views/Clients';
import Jobs from './src/views/Jobs';
import Pipeline from './src/views/Pipeline';
import Invoices from './src/views/Invoices';
import Compliance from './src/views/Compliance';
import Settings from './src/views/Settings';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
};

export default App;
