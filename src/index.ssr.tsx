import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

export function render(_url: string) {
  void _url; // Acknowledge parameter for ESLint
  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="system" storageKey="codesage-theme">
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
  return { html };
}
