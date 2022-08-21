import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { DownloadScreen } from './screens/download';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DownloadScreen />} />
      </Routes>
    </Router>
  );
}
