

import './App.css'
import { AuthProvider } from './components/AuthContext'

import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { router } from './Router'



import store from './store/store'
import Interview from './components/Interview'


function App() {

  return (
    <>
      <div>
     
   
           <Provider store={store}>
           <AuthProvider>
           <RouterProvider router={router} />
           <Interview/>
       
           </AuthProvider>
         </Provider>
    
   
      
  
    </div>
    
    </>
  )
}

export default App
