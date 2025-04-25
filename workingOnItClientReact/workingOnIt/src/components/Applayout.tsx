import type { ReactNode } from "react"
import { Box, Container } from "@mui/material"
import NavBar from "./NavBar"

interface AppLayoutProps {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
        {children}
      </Box>
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
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", color: "text.secondary" }}>
            © {new Date().getFullYear()} WorkingOnIt. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default AppLayout
