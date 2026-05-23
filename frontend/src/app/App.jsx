import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes.jsx';
import '../App.css';

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    const favicon = document.querySelector("link[rel~='icon']");
    if (theme === 'light') {
      document.body.classList.add('light');
      if (favicon) {
        favicon.href = "/favicon-light.svg?v=3";
      }
    } else {
      document.body.classList.remove('light');
      if (favicon) {
        favicon.href = "/favicon-dark.svg?v=3";
      }
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
