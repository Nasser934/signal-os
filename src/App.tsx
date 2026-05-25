import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DraftScorer from './pages/DraftScorer';
import Insights from './pages/Insights';
import Timeline from './pages/Timeline';
import Creators from './pages/Creators';
import Hashtags from './pages/Hashtags';
import Topics from './pages/Topics';
import Sentiment from './pages/Sentiment';
import Forecasting from './pages/Forecasting';
import Reports from './pages/Reports';
import Publish from './pages/Publish';
import CommandCenter from './pages/CommandCenter';
import Replies from './pages/Replies';
import WeeklyReport from './pages/WeeklyReport';
import Autopsy from './pages/Autopsy';
import Scorecard from './pages/Scorecard';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drafts" element={<DraftScorer />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/hashtags" element={<Hashtags />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/command" element={<CommandCenter />} />
          <Route path="/replies" element={<Replies />} />
          <Route path="/weekly" element={<WeeklyReport />} />
          <Route path="/autopsy" element={<Autopsy />} />
          <Route path="/scorecard" element={<Scorecard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
