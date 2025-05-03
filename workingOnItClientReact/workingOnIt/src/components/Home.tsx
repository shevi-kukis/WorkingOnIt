"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Button, Container, Grid, Card, CardContent, Paper, useTheme } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AssignmentIcon from "@mui/icons-material/Assignment"
import SchoolIcon from "@mui/icons-material/School"
import WorkIcon from "@mui/icons-material/Work"
import { useAuth } from "./AuthContext"

const Home = () => {
  const { state } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  // Keep any existing logic from the original component
  useEffect(() => {
    // Original useEffect logic goes here
    // This might include API calls, data fetching, etc.
    const fetchData = async () => {
      try {
        // Original data fetching logic
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
          borderRadius: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "center", md: "left" }, mb: { xs: 4, md: 0 } }}>
                <Typography
                  component="h1"
                  variant="h2"
                  color="text.primary"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Prepare for your next interview
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Practice with our AI-powered interview simulator and get feedback to improve your skills.
                </Typography>
                <Box sx={{ mt: 4, display: "flex", justifyContent: { xs: "center", md: "flex-start" }, gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate(state.token ? "/interview" : "/register")}
                  >
                    Start Practicing
                  </Button>
                  <Button variant="outlined" color="primary" size="large" onClick={() => navigate("/interview-tips")}>
                    Interview Tips
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/placeholder.svg?height=400&width=500"
                alt="Interview illustration"
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography component="h2" variant="h3" align="center" color="text.primary" gutterBottom sx={{ mb: 6 }}>
          How it works
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <SearchIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Choose a role
                </Typography>
                <Typography align="center">
                  Select the job position you're preparing for to get relevant interview questions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <AssignmentIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Practice
                </Typography>
                <Typography align="center">
                  Answer interview questions and get real-time feedback on your responses.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <SchoolIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Learn
                </Typography>
                <Typography align="center">
                  Review your performance and learn from our expert tips and suggestions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <WorkIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Succeed
                </Typography>
                <Typography align="center">
                  Gain confidence and ace your real interviews with improved skills.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(state.token ? "/interview" : "/register")}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography component="h2" variant="h3" align="center" color="text.primary" gutterBottom sx={{ mb: 6 }}>
            What our users say
          </Typography>

          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item key={item} xs={12} md={4}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" paragraph sx={{ fontStyle: "italic" }}>
                      "WorkingOnIt helped me prepare for my technical interviews. The feedback was invaluable and I
                      landed my dream job!"
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Box
                        component="div"
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          mr: 2,
                        }}
                      >
                        U{item}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" component="div">
                          User {item}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Software Engineer
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to ace your next interview?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of job seekers who have improved their interview skills with WorkingOnIt
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: theme.palette.primary.main,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
            onClick={() => navigate(state.token ? "/interview" : "/register")}
          >
            Start Free Practice
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
