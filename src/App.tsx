import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { router } from './routes'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        newestOnTop
        closeOnClick={false}
        pauseOnFocusLoss={false}
        hideProgressBar
        theme="dark"
      />
    </>
  )
}
