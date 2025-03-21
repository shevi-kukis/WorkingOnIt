

import './App.css'
import { AuthProvider } from './components/AuthContext'

import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { router } from './Router'


import Test from './components/Test'
import store from './store/store'


function App() {

  return (
    <>
      <div>
     
   
           <Provider store={store}>
           <AuthProvider>
           <RouterProvider router={router} />
           <Test/>
           </AuthProvider>
         </Provider>
    
   
      
  
    </div>
    
    </>
  )
}

export default App
