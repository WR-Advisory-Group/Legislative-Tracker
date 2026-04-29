import { Routes, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import BillsSearchPage from './pages/BillsSearchPage';
import KeywordsPage from './pages/KeywordsPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <Routes>
        <Route path="/" element={<BillsSearchPage />} />
        <Route path="/keywords" element={<KeywordsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
