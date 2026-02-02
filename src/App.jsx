import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Advertise from './pages/Advertise';
import NotFound from './pages/NotFound';
import Vereeniging from './pages/towns/Vereeniging';
import Vanderbijlpark from './pages/towns/Vanderbijlpark';
import Meyerton from './pages/towns/Meyerton';
import Sharpeville from './pages/towns/Sharpeville';
import Sasolburg from './pages/towns/Sasolburg';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Town Pages */}
          <Route path="/towns/vereeniging" element={<Vereeniging />} />
          <Route path="/towns/vanderbijlpark" element={<Vanderbijlpark />} />
          <Route path="/towns/meyerton" element={<Meyerton />} />
          <Route path="/towns/sharpeville" element={<Sharpeville />} />
          <Route path="/towns/sasolburg" element={<Sasolburg />} />

          {/* Placeholder routes - to be built */}
          <Route path="/explore" element={<Home />} />
          <Route path="/towns" element={<Home />} />
          <Route path="/things-to-do" element={<Home />} />
          <Route path="/restaurants" element={<Home />} />
          <Route path="/events" element={<Home />} />
          <Route path="/business" element={<Home />} />
          <Route path="/living" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/submit-news" element={<Home />} />
          <Route path="/privacy" element={<Home />} />
          <Route path="/terms" element={<Home />} />

          {/* 404 Not Found - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
