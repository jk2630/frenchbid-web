import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RequireGame from "./components/RequireGame.jsx"; // <-- 1. Import your new bouncer

import GameTable from "./components/ui/GameTable.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import GameRules from "./pages/GameRules.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Lobby from "./pages/Lobby.jsx";
import PlayerContextProvider from "./context/PlayerContext.jsx";
import { GameContextProvider } from "./context/GameContext.jsx";

// --- 2. Routes are now restructured ---
const router = createBrowserRouter(
  [
    // --- Public Routes ---
    // These routes do NOT require a user to be logged in
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <SignUpPage />,
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
    {
      path: "/game/rules",
      element: <GameRules />,
    },

    // --- Protected Routes ---
    // All routes inside this "children" array are protected by <ProtectedRoute />
    // This is Bouncer #1: "Are you logged in?"
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <App />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/lobby",
          element: <Lobby />,
        },

        // --- Nested Game Route ---
        // This is Bouncer #2: "Are you in a game?"
        // A user must be logged in AND have a game to see this
        {
          element: <RequireGame />,
          children: [
            {
              path: "/game",
              element: <GameTable />,
            },
          ],
        },
      ],
    },
  ]
  // {
  //   basename: "/frenchbid-web",
  // }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlayerContextProvider>
      <GameContextProvider>
        <RouterProvider router={router} />
      </GameContextProvider>
    </PlayerContextProvider>
  </StrictMode>
);
