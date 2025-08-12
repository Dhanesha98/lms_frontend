import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import { SnackbarProvider } from 'notistack';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      dense
      preventDuplicate
    >
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={<Signup/>} />
      </Routes>
    </SnackbarProvider>
  );
};

export default App;