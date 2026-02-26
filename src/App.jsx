import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Pages
import Home from './pages/Home';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Events from './pages/Events';
import Businesses from './pages/Businesses';
import VerifyBusiness from './pages/VerifyBusiness';
import Advertise from './pages/Advertise';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Subscribe from './pages/Subscribe';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Vereeniging from './pages/towns/Vereeniging';
import Vanderbijlpark from './pages/towns/Vanderbijlpark';
import Meyerton from './pages/towns/Meyerton';
import Sharpeville from './pages/towns/Sharpeville';
import Sasolburg from './pages/towns/Sasolburg';

function AppInner() {
  const location = useLocation();
  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== 'function') return;
    window.gtag('config', GA_ID, { page_path: location.pathname + location.search });
  }, [location]);

  return (
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

          {/* News & Events */}
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/verify-business" element={<VerifyBusiness />} />

          {/* Placeholder routes - to be built */}
          <Route path="/explore" element={<Home />} />
          <Route path="/towns" element={<Home />} />
          <Route path="/things-to-do" element={<Home />} />
          <Route path="/restaurants" element={<Home />} />
          <Route path="/business" element={<Businesses />} />
          <Route path="/living" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/submit-news" element={<Home />} />

          {/* 404 Not Found - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
