import React, { createContext, use, useEffect, useRef } from "react";
import { WSClient } from "./wsClient";

const WSContext = createContext<WSClient | null>(null);

interface WebSocketProviderProps {
  projectId: string;
  children: React.ReactNode;
}

export function WebSocketProvider({
  projectId,
  children,
}: WebSocketProviderProps) {
  const clientRef = useRef<WSClient | null>(null);

  clientRef.current ??= new WSClient(projectId);

  useEffect(() => {
    const client = clientRef.current;
    if (client) {
      client.connect();
    }
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [projectId]);

  return <WSContext value={clientRef.current}>{children}</WSContext>;
}

export function useWSClient() {
  const ctx = use(WSContext);
  if (!ctx) {
    throw new Error("useWSClient must be used within a WebSocketProvider");
  }
  return ctx;
}
