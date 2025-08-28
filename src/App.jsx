import { Routes, Route, Navigate } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import Dashboard from './Dashboard'; 
import UserManagement from './UserManagement';
import BookList from './BookList';
import { SnackbarProvider } from 'notistack';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem("role"); 

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      dense
      preventDuplicate
    >
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Home layout with nested routes */}
        <Route path="/home/*" element={isLoggedIn ? <Home /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
           {userRole === "admin" && <Route path="users" element={<UserManagement />} />}
         < Route path="books" element={<BookList />} />
          </Route>
      </Routes>
    </SnackbarProvider>
  );
};

export default App;
