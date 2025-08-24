import React from 'react';

import { LandingPage } from './components/landing-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AssetPage } from './components/asset-page';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './state/redux-configurator'; // Adjust path as needed

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/asset/:symbol/" element={<AssetPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}