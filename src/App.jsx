import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import styles from "./App.module.scss";
import Cursor from "./components/Cursor/Cursor";
import Nav from "./components/Nav/Nav";
import Hero from "./components/Hero/Hero";
import StatsBar from "./components/StatsBar/StatsBar";
import Features from "./components/Features/Features";
import IlluSections from "./components/IlluSections/IlluSections";
import PhotoBanner from "./components/PhotoBanner/PhotoBanner";
import Profiles from "./components/Profiles/Profiles";
import DownloadAuth from "./components/DownloadAuth/DownloadAuth";
import Footer from "./components/Footer/Footer";
import NoiseBg from "./components/shared/NoiseBg";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Invite from "./pages/Invite/Invite";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const LandingPage = () => {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.app}>
      <NoiseBg />
      <Cursor />
      <Nav />
      <Hero />
      <StatsBar />
      <Features />
      <IlluSections />
      <PhotoBanner />
      <Profiles />
      <DownloadAuth />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/race-invitation" element={<Invite />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
