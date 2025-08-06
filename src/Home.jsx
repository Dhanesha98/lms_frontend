import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Home = () => {
const navigate = useNavigate();
  
  const handleLogout = () => {
        localStorage.removeItem('Token');
        navigate('/login');
  };
  return(
    <div>
      <Stack spacing={2} direction="row">
      <div>Welcome to Home Page</div>
      <Button variant="contained" onClick={handleLogout}>LogOut</Button>
    </Stack>
  </div>
  );
};

export default Home;
