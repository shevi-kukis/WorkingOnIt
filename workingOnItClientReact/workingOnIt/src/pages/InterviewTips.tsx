import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import { FaLightbulb, FaUserTie, FaEnvelope, FaTshirt, FaBalanceScale, FaComments, FaBook } from "react-icons/fa";

const tips = [
  { title: "טיפים לראיון עבודה!", content: "", icon: <FaLightbulb size={30} color="#1976d2" /> },
  { title: "טרם הראיון", content: "ערכי \"מחקר\" על מקום העבודה.", icon: <FaUserTie size={30} color="#1976d2" /> },
  { title: "לאחר שהתקבלת", content: "לא נהוג לבקש לחשוב שוב אם את מעוניינת.", icon: <FaBalanceScale size={30} color="#1976d2" /> },
  { title: "תקשורת לפני הראיון", content: "אם ישנה תקשורת במייל, ודאי שהניסוח תקין, מכובד ומזמין והשאירי מספר פלאפון זמין.", icon: <FaEnvelope size={30} color="#1976d2" /> },
  { title: "הופעה חיצונית", content: "התלבשי בהתאם לתפקיד והקפידי על הופעה מסודרת.", icon: <FaTshirt size={30} color="#1976d2" /> },
  { title: "שמרי על ביטחון עצמי", content: "שמרי על איזון בין ביטחון עצמי לצניעות בראיון.", icon: <FaComments size={30} color="#1976d2" /> },
  { title: "הכיני תשובות לשאלות נפוצות", content: "התאמני מראש לענות על שאלות כמו \"ספרי לי על עצמך\".", icon: <FaBook size={30} color="#1976d2" /> },
];

const InterviewTips= () => {
  const [selectedTip, setSelectedTip] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ py: 6, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "300px",
          background: "linear-gradient(135deg, #2196F3 0%, #1976d2 100%)",
          borderRadius: "0 0 50% 50%",
          zIndex: -1,
        }}
      />
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: "bold", color: "white", position: "relative" }}>
        טיפים לראיון עבודה
      </Typography>
      <Typography variant="h6" align="center" color="white" gutterBottom position="relative">
        כל מה שאת צריכה לדעת כדי להצליח בראיון העבודה הבא שלך
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 5 }}>
        {tips.map((tip, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                onClick={() => setSelectedTip(tip)}
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                  p: 4,
                  boxShadow: 8,
                  borderRadius: "16px",
                  background: "white",
                  transition: "all 0.3s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {tip.icon}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {tip.title}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {selectedTip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <Box sx={{
            mt: 6,
            p: 5,
            borderRadius: "16px",
            boxShadow: 10,
            backgroundColor: "#fff",
            textAlign: "center",
            maxWidth: "600px",
            mx: "auto",
            border: "3px solid #1976d2",
          }}>
            <Typography variant="h4" gutterBottom color="primary">
              {selectedTip.title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {selectedTip.content}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Container>
  );
};

export default InterviewTips;
