import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import './toast-overrides.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer
  position="bottom-right"
  autoClose={4000}
   hideProgressBar={true}
  newestOnTop
  closeOnClick
  pauseOnHover
  theme="light" 
  transition={Slide}
/>
    <App />
    {/* <Toaster /> */}
  </StrictMode>,
)
