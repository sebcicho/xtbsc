import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from "@heroui/react"
import App from './App.tsx'
import './index.css'

// Suppress specific React warnings in development
if (import.meta.env.MODE === 'development') {
  const suppressedWarnings = [
    'defaultProps will be removed from function components',
  ];
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      suppressedWarnings.some(warning => args[0].includes(warning))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="dark text-foreground bg-background">
        <App />
      </main>
    </HeroUIProvider>
  </React.StrictMode>,
);
