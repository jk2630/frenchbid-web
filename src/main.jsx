import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

import GameTable from './components/ui/GameTable.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import AboutPage from "./pages/AboutPage.jsx";
import GameRules from "./pages/GameRules.jsx";

// routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <GameTable />,
    children: [
      {
        path: "rules",
        element: <GameRules />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <SignUpPage />
  },
  {
    path: "/about",
    element: <AboutPage />
  }
], {
  basename: "/frenchbid-web",
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
