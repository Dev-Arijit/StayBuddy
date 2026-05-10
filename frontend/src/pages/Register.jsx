import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", role: "student"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) { alert("Account created successfully"); navigate("/login"); }
      else { alert(result.message); }
    } catch (err) { console.error(err); alert("Something went wrong"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bright px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">StayBuddy</Link>
          <p className="text-sm text-on-surface-variant mt-1">Join the community</p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-outline-variant shadow-sm">
          <h1 className="text-xl font-semibold mb-6 text-center text-on-surface tracking-tight">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Full Name</label>
              <input name="name" placeholder="John Doe" value={formData.name} onChange={handleChange}
                className="input-base w-full text-sm" required />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Email</label>
              <input name="email" type="email" placeholder="you@university.edu" value={formData.email} onChange={handleChange}
                className="input-base w-full text-sm" required />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Phone</label>
              <input name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange}
                className="input-base w-full text-sm" required />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Password</label>
              <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange}
                className="input-base w-full text-sm" required />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">I am a</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-base w-full text-sm">
                <option value="student">Student</option>
                <option value="owner">Property Owner</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-50">
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}