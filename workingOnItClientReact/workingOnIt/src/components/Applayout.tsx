"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme } from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"
import { AppSidebar } from "./AppSidebar"


interface AppLayoutProps {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = useTheme()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
            WorkingOnIt
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <AppSidebar open={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "white",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ textAlign: "center", color: "text.secondary" }}>
          © {new Date().getFullYear()} WorkingOnIt. All rights reserved.
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout
