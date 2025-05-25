"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "./components/Applayout"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Interview from "./components/Interview"
import InterviewTips from "./components/InterviewTips"
import EditProfile from "./components/EditProfile"


import { useAuth } from "./components/AuthContext"
import type { JSX } from "react/jsx-runtime"
import DownLaodResume from "./components/DownLaodResume"

import InterviewScoresChart from "./components/InterviewScoresChart "
import UpLoadResume from "./components/UpLoadResume"


// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { state } = useAuth()

  if (!state.token) {
    return <Navigate to="/login" replace />
  }

  return children
}

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Interview />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-tips"
          element={
            <AppLayout>
              <InterviewTips />
            </AppLayout>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditProfile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/update-resume"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UpdateResume />
              </AppLayout>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/uploadResume"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UpLoadResume />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/download-resume"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DownLaodResume />
              </AppLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/chart"
          element={
            <ProtectedRoute>
              <AppLayout>
           <InterviewScoresChart/>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
