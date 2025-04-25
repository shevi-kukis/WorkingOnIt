"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

import { useAuth } from "./AuthContext"

const NavBar = () => {
  const { state, dispatch } = useAuth()
 
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null)
  }

  const handleLogout = () => {
  dispatch({ type: "LOGOUT" })
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("resume")
    localStorage.removeItem("interview")
    handleClose()
    navigate("/login")
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    handleMobileMenuClose()
    handleClose()
  }

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: "white" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", padding: { xs: "8px 0", md: "8px 16px" } }}>
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="WorkingOnIt Logo" style={{ height: 40, marginRight: 12 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 500,
                color: theme.palette.primary.main,
                display: { xs: "none", sm: "block" },
              }}
            >
              WorkingOnIt
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMobileMenu}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchorEl}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleNavigation("/")}>Home</MenuItem>
                <MenuItem onClick={() => handleNavigation("/interview-tips")}>Interview Tips</MenuItem>
                {state.token
                  ? [
                      <MenuItem key="uploadResume" onClick={() => handleNavigation("/uploadResume")}>
                        uploadResume
                      </MenuItem>,
                       <MenuItem key="interview" onClick={() => handleNavigation("/interview")}>
                       Interview
                     </MenuItem>,
                      <MenuItem key="profile" onClick={() => handleNavigation("/edit-profile")}>
                        Profile
                      </MenuItem>,
                      <MenuItem key="logout" onClick={handleLogout}>
                        Logout
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem key="login" onClick={() => handleNavigation("/login")}>
                        Login
                      </MenuItem>,
                      <MenuItem key="register" onClick={() => handleNavigation("/register")}>
                        Register
                      </MenuItem>,
                    ]}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button color="inherit" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate("/interview-tips")}>
                Interview Tips
              </Button>
              {state.token && (
                <><Button color="inherit" onClick={() => navigate("/interview")}>
                    Interview
                  </Button><Button color="inherit" onClick={() => navigate("/uploadResume")}>
                  uploadResume
                    </Button></>
              )}

              {state.token ? (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                      {state.user?.fullName?.charAt(0).toUpperCase()}
                    </Avatar>


                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleNavigation("/edit-profile")}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" color="primary" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => navigate("/register")}>
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar
