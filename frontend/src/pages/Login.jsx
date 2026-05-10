import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      if (res.data.success) {
        const { token, user } = res.data.data;
        localStorage.setItem("token", token);
        login(user);
        navigate("/dashboard");
      } else { alert(res.data.message); }
    } catch (error) { console.error(error); alert("Login failed"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bright px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">StayBuddy</Link>
          <p className="text-sm text-on-surface-variant mt-1">Your Perfect Stay Awaits</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl border border-outline-variant space-y-5 shadow-sm"
        >
          <h1 className="text-xl font-semibold text-center text-on-surface tracking-tight">
            Welcome Back
          </h1>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@university.edu"
              required
              className="input-base w-full text-sm"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="input-base w-full text-sm"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-50">
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;