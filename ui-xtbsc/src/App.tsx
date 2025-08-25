import React from 'react';

import { LandingPage } from './components/landing-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AssetPage } from './components/asset-page';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './state/redux-configurator';
import { Navbar, NavbarBrand, Link } from "@heroui/react";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Navbar shouldHideOnScroll={false} isBordered maxWidth="full" className="bg-content1">
            <NavbarBrand>
              <Link href="/" color="foreground" className="font-bold text-inherit">
                <span className="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                  </svg>
                </span>
                <span className="text-3xl">XTBSC</span>
              </Link>
            </NavbarBrand>
          </Navbar>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/asset/:symbol/" element={<AssetPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}