import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function GoogleAuthCallback() {
  const [auth, setAuth] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location) {
      return;
    }
    const { search } = location;
    // console.log('User Agent:', navigator.userAgent);
    axios({
      method: 'GET',
      url: `${API_URL}/api/auth/google/callback${search}`,
      headers: {
        'User-Agent': navigator.userAgent,
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then((res) => res.data)
      .then((data) => {
        setAuth(data);
        if (data.user.email === 'moviemadsindia@gmail.com') {
  localStorage.setItem('IsAdmin', 'true');
} else {
  localStorage.setItem('IsAdmin', 'false');
}
        localStorage.setItem('User', JSON.stringify(data));
        localStorage.setItem('UserId', data.user.id);
        localStorage.setItem('EmailId', data.user.email);
        localStorage.setItem('JwtToken', data.jwt);

        const redirectUrl = localStorage.getItem('redirect') || '/';
        navigate(redirectUrl);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error('Error during authentication', error);
        navigate('/login');
      });
  }, [location, navigate]);

  return null;
}

export default GoogleAuthCallback;
