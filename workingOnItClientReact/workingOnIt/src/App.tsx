

import './App.css'
import { AuthProvider } from './components/AuthContext'

import { RouterProvider } from 'react-router-dom'
import { router } from './Router'


function App() {

  return (
    <>
      <div>
      <AuthProvider>
      <RouterProvider router={router} />
   
    
    </AuthProvider>
   
      
  
    </div>
    
    </>
  )
}

export default App
