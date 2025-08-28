import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import { jwtDecode } from "jwt-decode";

const drawerWidth = 240;

function getUserRole() {
  const token = localStorage.getItem("token"); 
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || decoded["custom:role"] || null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getUserRole();

  const showDashboard = location.pathname === "/home" || location.pathname === "/home/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap>
            Library Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box>
          <List>
            <ListItemButton onClick={() => navigate("/home")}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            {role === "admin" && (
              <ListItemButton onClick={() => navigate("/home/users")}>
                <ListItemText primary="User Management" />
              </ListItemButton>
            )}
            <ListItemButton onClick={() => navigate("/home/books")}>
              <ListItemText primary="Book Management" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {/* Dashboard boxes visible only on /home */}
        {showDashboard ? (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {role === "admin" && (
              <Grid xs={12} sm={6} md={4}>
                <Paper
                  sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
                  onClick={() => navigate("/home/users")}
                >
                  <Typography variant="h6">User Management</Typography>
                </Paper>
              </Grid>
            )}
            <Grid xs={12} sm={6} md={4}>
              <Paper
                sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
                onClick={() => navigate("/home/books")}
              >
                <Typography variant="h6">Book Management</Typography>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          // Render child route components only when not on /home
          <Outlet />
        )}
      </Box>
    </Box>
  );
}
