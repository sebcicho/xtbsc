import { CurrencyDashboard } from "./dashboards/currency-dashboard.component";
import { StockDashboard } from "./dashboards/stock-dashboard.component";


export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
          <div>
            <div className="mb-16">
              <StockDashboard type='ETF' limit={4}></StockDashboard>
            </div>
            <div className="mb-16">
              <StockDashboard type='ST' limit={4}></StockDashboard>
            </div>
           <div className="mb-16">
              <CurrencyDashboard limit={4}></CurrencyDashboard>
            </div>
           
          </div>
        </div>
  );
};
