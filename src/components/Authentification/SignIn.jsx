import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from './CustomIcons';
import AppTheme from './AppTheme';
import Link from '@mui/material/Link';
import wilayaLogo from '../../assets/logos/wilaya_tanger_logo.jpg'; // Import the logo
import { FormLabel } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateInputs();
    if (!isValid) return;

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', formData);
      const token = response.data.accessToken;
      const role = response.data.roles[0];
      const username = response.data.username;
      const id = response.data.id;

      localStorage.setItem('username', username);
      localStorage.setItem('authToken', token);
      localStorage.setItem('role', role);
      localStorage.setItem('id', id);

      // Redirect based on role
      if (role === 'ROLE_ADMIN') {
        navigate('/admin/materialList');
      } else if (role === 'ROLE_EMPLOYEE') {
        navigate('/employee/assignment');
      }

      setMessage('Login successful!');
      setError('');
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response ? err.response.data.message : 'An error occurred');
      setMessage('');
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!formData.username) {
      setUsernameError(true);
      setUsernameErrorMessage('Please enter your username.');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }

    if (!formData.password || formData.password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <CssBaseline enableColorScheme />
        <Card variant="outlined">
          <Stack direction="row" alignItems="center" spacing={2} mb={2} marginLeft="40px">
            <img src={wilayaLogo} alt="Wilaya Logo" style={{ width: '100px', height: 'auto' }} /> {/* Adjust the size */}
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontSize: 'clamp(3rem, 10vw, 2.15rem)', fontWeight: 'bold' }}
            >
              Sign in
            </Typography>
          </Stack>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>

              <FormLabel htmlFor="username" sx={{marginRight:'900px',fontWeight: 'bold' }}>Username</FormLabel>
              <TextField
                error={usernameError}
                helperText={usernameErrorMessage}
                id="username"
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password"sx={{fontWeight: 'bold' }}>Password</FormLabel>
                {/* Remove or define `handleClickOpen` if you want to use it */}
                <Link
                  component="button"
                  type="button"
                  onClick={() => alert('Forgot password?')}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Forgot your password?
                </Link>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
