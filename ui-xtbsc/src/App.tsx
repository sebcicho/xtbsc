import React from 'react';

import { LandingPage } from './components/landing-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AssetPage } from './components/asset-page';

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/asset/:symbol/:type" element={<AssetPage />} />
      </Routes>
    </BrowserRouter>
  );
}