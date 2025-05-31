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
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img src="/logo.svg" alt="WorkingOnIt Logo" style={{ height: 32 }} />
            <Typography variant="h6" component="div" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              WorkingOnIt
            </Typography>
          </Box>
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
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
