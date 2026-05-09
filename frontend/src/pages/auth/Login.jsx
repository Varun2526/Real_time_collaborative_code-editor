import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import KodaxLogo from '../../components/KodaxLogo';

const API_URL = 'http://localhost:4000/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData, { withCredentials: true });
      console.log('Login successful:', res.data);
      login(res.data.payload);
      
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.post(
          `${API_URL}/auth/google`,
          { access_token: tokenResponse.access_token },
          { withCredentials: true }
        );
        console.log('Google Login successful:', res.data);
        login(res.data.payload);
        
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.response?.data?.error || 'Google login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Sign-In was cancelled or failed');
    }
  });

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-body-base bg-black">
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col">
        <div className="mb-12 text-center">
          <KodaxLogo size="lg" />
          <p className="text-spacex-nav opacity-70">
            NEW USER? <Link to="/register" state={{ from: location.state?.from }} className="text-white hover:opacity-70 transition-opacity underline underline-offset-4">REGISTER</Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[#ff3333] bg-[#ff3333]/10 text-[#ff3333] text-spacex-nav text-center">
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-[rgba(240,240,250,0.35)] py-4 text-spacex-nav text-lg focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
            placeholder="EMAIL"
          />

          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-[rgba(240,240,250,0.35)] py-4 text-spacex-nav text-lg focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
            placeholder="PASSWORD"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-ghost mt-6 w-full text-center disabled:opacity-50"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-10 opacity-30">
          <div className="flex-1 border-t border-white"></div>
          <span className="px-4 text-spacex-micro">OR SIGN IN WITH</span>
          <div className="flex-1 border-t border-white"></div>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="btn-ghost flex items-center justify-center gap-3 w-full"
            style={{ padding: '12px' }}
          >
            <svg height="18" aria-hidden="true" viewBox="0 0 48 48" version="1.1" width="18">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            SIGN IN WITH GOOGLE
          </button>
          
          <button
            type="button"
            onClick={() => {
              const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
              window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
            }}
            className="btn-ghost flex items-center justify-center gap-3 w-full"
            style={{ padding: '12px' }}
          >
            <svg height="18" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="18" data-view-component="true" className="fill-white">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            SIGN IN WITH GITHUB
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
