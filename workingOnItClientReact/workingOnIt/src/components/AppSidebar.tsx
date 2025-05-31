"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Collapse,
  useTheme,
  IconButton,
  Avatar,
} from "@mui/material"
import {
  Home,
  QuestionAnswer,
  Upload,
  BarChart,
  Person,
  ExitToApp,
  MenuBook,
  ExpandLess,
  ExpandMore,
  Close,
} from "@mui/icons-material"
import { useAuth } from "./AuthContext"

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Home",
        url: "/",
        icon: Home,
        requiresAuth: false, // Allow everyone to see home
      },
      {
        title: "Interview Tips",
        url: "/interview-tips",
        icon: MenuBook,
        requiresAuth: false, // Allow everyone to see interview tips
      },
    ],
  },
  {
    title: "Interview",
    items: [
      {
        title: "Start Interview",
        url: "/interview",
        icon: QuestionAnswer,
        requiresAuth: true,
      },
      {
        title: "Upload Resume",
        url: "/uploadResume",
        icon: Upload,
        requiresAuth: true,
      },
      {
        title: "Progress Chart",
        url: "/chart",
        icon: BarChart,
        requiresAuth: true,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: "/edit-profile",
        icon: Person,
        requiresAuth: true,
      },
    ],
  },
]

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const navigate = useNavigate()
  const { state, dispatch } = useAuth()
  const theme = useTheme()
  const [expandedSections, setExpandedSections] = useState<string[]>(["Main", "Interview", "Account"])

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("resume")
    localStorage.removeItem("interview")
    localStorage.removeItem("welcomeMessage")
    navigate("/login")
    onClose()
  }

  const handleNavigation = (url: string) => {
    navigate(url)
    // Don't close sidebar automatically - let user close it manually
  }

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle) ? prev.filter((title) => title !== sectionTitle) : [...prev, sectionTitle],
    )
  }

  const drawerContent = (
    <Box sx={{ width: 280, height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => handleNavigation("/")}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              color: "white",
              mr: 2,
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            {state.user?.fullName?.charAt(0) || "G"}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              WorkingOnIt
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {state.user?.fullName || "Guest"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {menuItems.map((section) => (
          <Box key={section.title}>
            <ListItemButton onClick={() => toggleSection(section.title)} sx={{ px: 2 }}>
              <ListItemText
                primary={section.title}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              />
              {expandedSections.includes(section.title) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandedSections.includes(section.title)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items
                  .filter((item) => !item.requiresAuth || state.token)
                  .map((item) => (
                    <ListItem key={item.title} disablePadding>
                      <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation(item.url)}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <item.icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Collapse>
          </Box>
        ))}

        <Divider sx={{ my: 1 }} />

        {/* Auth Actions */}
        {state.token ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ px: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation("/login")} sx={{ px: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation("/register")} sx={{ px: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 280,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
