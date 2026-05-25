import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StubPage from './pages/StubPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<StubPage />} />
          <Route path="/drafts" element={<StubPage />} />
          <Route path="/insights" element={<StubPage />} />
          <Route path="/timeline" element={<StubPage />} />
          <Route path="/creators" element={<StubPage />} />
          <Route path="/hashtags" element={<StubPage />} />
          <Route path="/topics" element={<StubPage />} />
          <Route path="/sentiment" element={<StubPage />} />
          <Route path="/forecasting" element={<StubPage />} />
          <Route path="/reports" element={<StubPage />} />
          <Route path="/publish" element={<StubPage />} />
          <Route path="/command" element={<StubPage />} />
          <Route path="/replies" element={<StubPage />} />
          <Route path="/weekly" element={<StubPage />} />
          <Route path="/autopsy" element={<StubPage />} />
          <Route path="/scorecard" element={<StubPage />} />
          <Route path="/settings" element={<StubPage />} />
          <Route path="/pricing" element={<StubPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
