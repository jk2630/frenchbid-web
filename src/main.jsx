import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

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

// routes
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/game",
      element: <GameTable />,
    },
    {
      path: "/game/rules",
      element: <GameRules />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <SignUpPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/lobby",
      element: <Lobby />,
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
  ]
  // {
  //   basename: "/frenchbid-web",
  // }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GameContextProvider>
      <PlayerContextProvider>
        <RouterProvider router={router} />
      </PlayerContextProvider>
    </GameContextProvider>
  </StrictMode>
);
