import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './components/auth/Signin.jsx'
import SignUp from './components/auth/Signup.jsx'
import MyAnnPage from './components/announcements/MyAnnPage.jsx'
import CreateAnn from './components/forms/CreateAnn.jsx'
import AnnBig from './components/announcements/AnnBig.jsx'
import AnnPage from './components/announcements/AnnPage.jsx'
import UpdateForm from './components/forms/UpdateForm.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    }, {
        path: '/signin',
        element: <SignIn />
    }, {
        path: '/signup',
        element: <SignUp />
    }, {
        path: '/:userId/myannouncements',
        element: <MyAnnPage />
    }, {
        path: '/:userId/myannouncements/create',
        element: <CreateAnn />
    }, {
        path: '/announcements/:userId/:announcementId',
        element: <AnnBig />
    }, {
        path: '/announcements',
        element: <AnnPage />
    }, {
        path: '/:userId/announcements/:announcementId/update',
        element: <UpdateForm />
    }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)