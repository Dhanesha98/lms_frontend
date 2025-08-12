import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, Stack, TextField, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import libraryImage from './assets/library.jpg';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt started'); // Debug log
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', {
        email,
        password,
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      console.log('Login successful, showing success snackbar'); // Debug log
      enqueueSnackbar('Login Successful!', { 
        variant: 'success',
        autoHideDuration: 3000,
      });
      setLoggedIn(true);
    } catch (err) {
      console.log('Login failed, showing error snackbar'); // Debug log
      enqueueSnackbar('Invalid Email or Password', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/home');
    }
  }, [loggedIn, navigate]);

  return (
    <Grid sx={{ 
       display: 'flex', 
    height: '100vh', 
    overflow: 'hidden'

     }}>
      <Grid
        sx={{
          width: '50%',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={libraryImage}
          alt="Library"
          sx={{
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Grid>
      <Grid
        sx={{
          width: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 4,
          pt: 8,
        }}
      >
        <Paper elevation={6} sx={{ padding: 5, width: '100%', maxWidth: 500 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                type="email"
                label="Email Address"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign In
              </Button>
              <Typography spacing={2} variant="h6" align="left" gutterBottom fontSize={14}>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;