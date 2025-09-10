import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from "@heroui/react"
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom'

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

    <Auth0Provider
    domain="dev-46juhlycxsc7dcbq.us.auth0.com"
    clientId="iX76ZezWM0QaU7p7IklXQNNAzSeYYkm4"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "localhost:8080/"
  }}
    >
      <HeroUIProvider>
        <main className="dark text-foreground bg-background">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </main>
      </HeroUIProvider>
    </Auth0Provider>,
);
