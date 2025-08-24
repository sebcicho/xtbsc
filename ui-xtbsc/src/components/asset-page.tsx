import { useParams } from "react-router-dom";
import { ChartType } from "../interfaces/enums";
import { FinancialChart } from "./financial-chart";
import { Spinner } from "@heroui/react";


export const AssetPage: React.FC = () => {
  // Assumes your route is like /asset/:symbol/:type
  const { symbol, type } = useParams<{ symbol: string; type: string }>();

  // Map string to ChartType enum
  const chartType = type === 'stock' ? ChartType.STOCK : ChartType.CURRENCY;

  return (
    <div className="max-w-4xl mx-auto py-8">
    {
        symbol ? <FinancialChart
            symbol={symbol}
            chartType={chartType}
            title={`${symbol} ${chartType === ChartType.STOCK ? 'Stock' : 'Currency'} Chart`}
        /> : (
            <div className="flex justify-center items-center h-40">
                <Spinner />
            </div>
        )
    }
    </div>
  );
};
