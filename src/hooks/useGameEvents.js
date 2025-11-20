import { useEffect, useRef } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_ENDPOINT;

const useGameEvents = (playerId, gameId, eventHandlers) => {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    // If no player or no active game → stop.
    if (!playerId || !gameId) {
      console.log("SSE: No active game → closing connection");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    // Already connected → avoid duplicate connections
    if (eventSourceRef.current) {
      console.log("SSE already connected");
      return;
    }

    console.log("SSE: Connecting to game:", gameId);

    const url = `${BASE_URL}/game/${gameId}/subscribe/${playerId}`;
    const es = new EventSource(url, { withCredentials: true });

    eventSourceRef.current = es;

    es.onopen = () => {
      console.log("SSE: Connection opened");
    };

    es.onmessage = (event) => {
      console.log("invalid event received:", event);
    };

    Object.keys(eventHandlers).forEach((eventType) => {
      es.addEventListener(eventType, (event) => {
        let parsed = event.data;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          // If not JSON, leave it as raw string
        }
        eventHandlers[eventType]?.(parsed);
      });
    });

    es.onerror = (err) => {
      console.error("SSE error:", err);
      // If connection breaks, EventSource auto-reconnects
    };

    return () => {
      console.log("SSE: Cleanup...");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [playerId, gameId]);
};

export default useGameEvents;
