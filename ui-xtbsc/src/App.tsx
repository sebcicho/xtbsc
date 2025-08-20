import React from 'react';

import { StockDashboard } from './components/stock-dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">XTBSC</h1>
      <div>
        <div className="mb-16">
          <StockDashboard type='ETF' limit={4}></StockDashboard>
        </div>
        <div className="mb-16">
          <StockDashboard type='ST' limit={4}></StockDashboard>
        </div>
       
      </div>
    </div>
  );
}