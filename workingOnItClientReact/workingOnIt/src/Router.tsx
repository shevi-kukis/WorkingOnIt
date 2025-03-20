import { createBrowserRouter, Outlet } from "react-router";

import { Box } from "@mui/material";
import AppLayout from "./components/Applayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import HomeLogin from "./components/homeLogin";
import InterviewTips from "./pages/InterviewTips";




export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <h1>error</h1>,
    children: [
      {
        path: 'Home',
        element: (
          <Box
            sx={{

              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <Home />
          </Box>
        ),
      },
      {
        path: 'signUp',
        element: (
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <Register />
          </Box>
        ),
      },
      {
        path: 'signIn',
        element: (<Box
          sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <> <Login />   <Outlet /> </></Box>
        ),

      },  {
        path: 'homeLogin',
        element: (<Box
          sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
         <HomeLogin/> </Box>
        )},
        {
          path: 'interviewTips',
          element: (<Box
            sx={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
          >
           <InterviewTips/> </Box>
          ),
      },

    ],
  },
]);
