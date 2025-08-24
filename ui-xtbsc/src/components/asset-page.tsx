import { useParams } from "react-router-dom";
import { FinancialChart } from "./financial-chart";
import { Spinner } from "@heroui/react";
import { useSelector } from "react-redux";
import { RootState } from "../state/redux-configurator";
import { ChartType } from "../interfaces/enums";


export const AssetPage: React.FC = () => {
  // Assumes your route is like /asset/:symbol/:type
  const { symbol } = useParams<{ symbol: string; }>();
  const stockMetadata = useSelector((state: RootState) => state.metadata.stockMetadata);
  const currencyMetadata = useSelector((state: RootState) => state.metadata.currencyMetadata);

  const stockAssetFromState = {
    ...stockMetadata.find(item => item.symbol === symbol)
  }

  const currencyAsset = currencyMetadata.find(item => item === symbol);

  const chartType = stockAssetFromState ? ChartType.STOCK : ChartType.CURRENCY;

  return (
    <div className="min-h-screen w-full bg-background">
    {
        symbol ? <FinancialChart
            symbol={symbol}
            chartType={chartType}
        /> : (
            <div className="flex justify-center items-center h-40">
                <Spinner/>
            </div>
        )
    }
    </div>
  );
};
