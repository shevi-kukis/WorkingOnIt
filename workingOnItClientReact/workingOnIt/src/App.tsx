// "use client"

import { useState, useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Router from "./Router"

import "./App.css" // Make sure to import the CSS
import { Provider } from "react-redux"
import { RouterProvider } from "react-router"
import store from "./store/store"
import { AuthProvider } from "./components/AuthContext"
// import { AuthProvider } from "./components/AuthContext"

const theme = createTheme({
  palette: {
    primary: {
      main: "#00bcd4", // Turquoise color
      light: "#4dd0e1",
      dark: "#0097a7",
      contrastText: "#fff",
    },
    secondary: {
      main: "#26a69a", // Secondary turquoise shade
      light: "#64d8cb",
      dark: "#00766c",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: "8px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.12)",
          },
        },
        contained: {
          boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
})

function App() {

  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    fetch("https://workingonitaiserver.onrender.com/ping")
      .then(() => console.log("Ping sent to Python server"))
      .catch(err => console.error("Ping failed:", err));
  }, []);
  

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <img
          src="/logo.svg"
          alt="WorkingOnIt Logo"
          style={{
            width: "120px",
            animation: "pulse 1.5s infinite ease-in-out",
          }}
        />
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0.6; transform: scale(0.98); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Provider store={store}>
           <AuthProvider>
           <Router />
      
       
           </AuthProvider>
         </Provider>
   
    </ThemeProvider>
  )
}

export default App

