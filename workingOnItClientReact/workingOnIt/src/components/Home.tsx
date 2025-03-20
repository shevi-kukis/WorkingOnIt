import React from "react";
import { Container, Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaBriefcase, FaFileAlt } from "react-icons/fa";

const features = [
  {
    title: "סימולציות ראיון עבודה",
    description: "התנסה בראיונות אמיתיים עם משוב מקצועי.",
    icon: <FaChalkboardTeacher size={40} color="#1976d2" />,
  },
  {
    title: "מבחני ידע",
    description: "בדוק את הידע שלך לפני הראיון האמיתי.",
    icon: <FaBriefcase size={40} color="#1976d2" />,
  },
  {
    title: "שיפור קורות חיים",
    description: "העלה קובץ קורות חיים וקבל טיפים לשיפור.",
    icon: <FaFileAlt size={40} color="#1976d2" />,
  },
];

const Home= () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* באנר ראשי */}
      <Box
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/1600x900/?business,meeting)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          הדרך שלך להצלחה בראיון העבודה
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: "600px" }}>
          קבל כלים מתקדמים לשיפור הביצועים שלך בראיונות עבודה אמיתיים
        </Typography>
   
        <Button  variant="contained" color="secondary" size="large" sx={{ mt: 3 }}>
          התחל עכשיו
        </Button>
      </Box>

      {/* כרטיסיות מידע */}
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 4,
                  boxShadow: 6,
                  borderRadius: "16px",
                  transition: "all 0.3s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {feature.icon}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
