import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_URL } from '../../utils/constants.js';

function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Processing GitHub Login...');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setStatus('No authorization code found.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    const authenticateWithGithub = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/auth/github`,
          { code },
          { withCredentials: true }
        );
        console.log('GitHub login successful:', res.data);
        login(res.data.payload);
        setStatus('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } catch (err) {
        console.error('GitHub authentication error:', err);
        setStatus(err.response?.data?.error || 'GitHub login failed.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    authenticateWithGithub();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
           ⚡ <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">KodaX</span>
        </h2>
        <p className="text-gray-300">{status}</p>
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}

export default GithubCallback;
