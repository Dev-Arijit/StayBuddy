import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppContent() {
  const [properties, setProperties] = useState([]);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAuth = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    fetch("http://localhost:5000/api/properties")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setProperties(result.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* Show Navbar on all pages except auth */}
      {!isAuth && <Navbar />}
      <Routes>
        <Route path="/" element={<Home properties={properties} />} />
        <Route path="/listings" element={<Listings properties={properties} />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {/* Show Footer on non-auth, non-dashboard pages */}
      {!isAuth && !isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
