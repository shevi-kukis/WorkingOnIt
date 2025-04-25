"use client"

import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"

const InterviewTips = () => {
  const theme = useTheme()

  const commonQuestions = [
    {
      question: "Tell me about yourself",
      tips: [
        "Keep it professional and relevant to the job",
        "Structure your answer: past, present, future",
        "Highlight key achievements and skills",
        "Keep it concise (1-2 minutes)",
      ],
    },
    {
      question: "What are your strengths and weaknesses?",
      tips: [
        "Choose strengths relevant to the position",
        "Back up strengths with specific examples",
        "For weaknesses, show self-awareness and improvement steps",
        "Avoid clichés like 'I'm a perfectionist'",
      ],
    },
    {
      question: "Why do you want to work here?",
      tips: [
        "Research the company thoroughly beforehand",
        "Connect your career goals with the company's mission",
        "Mention specific aspects of the company culture that appeal to you",
        "Show enthusiasm for the role and company",
      ],
    },
    {
      question: "Where do you see yourself in 5 years?",
      tips: [
        "Show ambition while being realistic",
        "Align your goals with potential growth at the company",
        "Demonstrate commitment to long-term career development",
        "Focus on skills you want to develop rather than specific titles",
      ],
    },
  ]

  const dosDonts = {
    dos: [
      "Research the company thoroughly",
      "Prepare specific examples of your achievements",
      "Practice your answers but don't memorize them",
      "Dress professionally and appropriately for the company culture",
      "Arrive 10-15 minutes early",
      "Bring extra copies of your resume",
      "Ask thoughtful questions about the role and company",
      "Send a thank-you note after the interview",
    ],
    donts: [
      "Arrive late or too early",
      "Speak negatively about previous employers",
      "Use slang or inappropriate language",
      "Check your phone during the interview",
      "Lie about your experience or qualifications",
      "Ask about salary or benefits in the first interview",
      "Give vague or generic answers",
      "Interrupt the interviewer",
    ],
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight={500}>
          Interview Tips & Strategies
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
          Prepare for your next interview with our comprehensive guide to common questions, best practices, and expert
          advice.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Common Interview Questions
            </Typography>
            <Typography variant="body1" paragraph>
              Being prepared for these frequently asked questions will help you feel more confident and make a better
              impression.
            </Typography>

            <Box sx={{ mt: 3 }}>
              {commonQuestions.map((item, index) => (
                <Accordion key={index} sx={{ mb: 2, "&:before": { display: "none" } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      color: "white",
                      borderRadius: "8px 8px 0 0",
                      "&.Mui-expanded": {
                        borderRadius: "8px 8px 0 0",
                      },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={500}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {item.tips.map((tip, tipIndex) => (
                        <ListItem key={tipIndex}>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Interview Do's and Don'ts
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%", bgcolor: "rgba(0, 188, 212, 0.05)" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="primary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Do's
                    </Typography>
                    <List dense>
                      {dosDonts.dos.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%", bgcolor: "rgba(255, 82, 82, 0.05)" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="error" sx={{ display: "flex", alignItems: "center" }}>
                      <ErrorOutlineIcon sx={{ mr: 1 }} /> Don'ts
                    </Typography>
                    <List dense>
                      {dosDonts.donts.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <ErrorOutlineIcon color="error" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Quick Tips
            </Typography>

            <List>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <LightbulbOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Use the STAR Method"
                  secondary="Situation, Task, Action, Result - structure your answers to behavioral questions using this framework."
                />
              </ListItem>

              <Divider component="li" />

              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <LightbulbOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Research the Company"
                  secondary="Know the company's mission, values, products, and recent news. This shows genuine interest."
                />
              </ListItem>

              <Divider component="li" />

              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <LightbulbOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Prepare Questions"
                  secondary="Have 3-5 thoughtful questions ready to ask the interviewer about the role, team, and company."
                />
              </ListItem>

              <Divider component="li" />

              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <LightbulbOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Body Language Matters"
                  secondary="Maintain good posture, make eye contact, and offer a firm handshake. These non-verbal cues make a strong impression."
                />
              </ListItem>

              <Divider component="li" />

              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <LightbulbOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Follow Up"
                  secondary="Send a thank-you email within 24 hours of your interview to express your continued interest."
                />
              </ListItem>
            </List>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.primary.main,
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", mb: 2 }}>
              <FormatQuoteIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Typography variant="h6" gutterBottom fontStyle="italic">
              "Before anything else, preparation is the key to success."
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9, textAlign: "right", mt: 2 }}>
              — Alexander Graham Bell
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default InterviewTips
