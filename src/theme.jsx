// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", 
    primary: {
      main: "#195ad2ff", 
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#27a7b0ff", 
      contrastText: "#ffffff",
    },
    background: {
      default: "#f0efefff",
      paper: "#ffffff",
    },
    text: {
      primary: "#2e2f30ff",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeightRegular: 400,
    fontWeightBold: 800,
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
