import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const companyLinks = [
    { label: "About Us", to: "/" },
    { label: "Contact", to: "/" },
    { label: "Housing", to: "/listings" },
    { label: "Career", to: "/" },
  ];

  const legalLinks = [
    { label: "Terms", to: "/" },
    { label: "Privacy", to: "/" },
    { label: "Cookie Policy", to: "/" },
  ];

  return (
    <footer className="lp-footer" style={{ background: "#0F0F1A", color: "#fff" }}>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div>
            <Link
              to="/"
              className="text-lg font-extrabold tracking-tight"
              style={{ color: "#fff" }}
            >
              STAYBUDDY
            </Link>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: "#9CA3AF" }}>
              The world's leading marketplace for international student housing, helping
              students find their perfect home away from home.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: "language", label: "Website" },
                { icon: "alternate_email", label: "Twitter" },
                { icon: "photo_camera", label: "Instagram" },
              ].map((s) => (
                <button
                  key={s.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "#1F1F30", color: "#9CA3AF" }}
                  title={s.label}
                >
                  <span className="material-icons-round text-sm">{s.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#fff" }}>
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm" style={{ color: "#9CA3AF" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#fff" }}>
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm" style={{ color: "#9CA3AF" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#fff" }}>
              Newsletter
            </h4>
            <p className="text-xs mb-3" style={{ color: "#9CA3AF" }}>
              Get the latest student housing updates.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
                style={{ background: "#1F1F30", border: "1px solid #2D2D44", color: "#fff" }}
                id="footer-newsletter-input"
              />
              <button
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{ background: "#6B21A8", color: "#fff" }}
                id="footer-newsletter-btn"
              >
                Join
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: "1px solid #1F1F30" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: "#6B7280" }}>
            © {new Date().getFullYear()} StayBuddy. All Rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            Your Perfect Stay Awaits.
          </p>
        </div>
      </div>

    </footer>
  );
}