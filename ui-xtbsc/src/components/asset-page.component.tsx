import { useParams } from "react-router-dom";
import { FinancialChart } from "./financial-chart.component";
import { Spinner } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/redux-configurator";
import { ChartType } from "../interfaces/enums";
import { useEffect, useState } from "react";
import { setCurrencyMetadata, setStockMetadata } from "../state/metadata-reducer";
import { StockMetadata } from "../interfaces/stock-metadata";
import { AssetInfo } from "./asset-info.component";


export const AssetPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string; }>();
  const stockMetadata = useSelector((state: RootState) => state.metadata.stockMetadata);
  const currencyMetadata = useSelector((state: RootState) => state.metadata.currencyMetadata);
  const currentData = useSelector((state: RootState) => state.currentData.currentData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const stockAssetFromState = stockMetadata.find(item => item.symbol === symbol);

  const currencyAsset = currencyMetadata.find(item => item === symbol);

  const chartType = stockAssetFromState ? ChartType.STOCK : ChartType.CURRENCY;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [symbol]);

  useEffect(() => {
    if (!stockAssetFromState && !currencyAsset && symbol) {
      setLoading(true);
      Promise.all([
        fetch(`http://localhost:8080/stock/metadata`).then(res => res.json()),
        fetch(`http://localhost:8080/currency/metadata`).then(res => res.json())
      ])
        .then(([stockRes, currencyRes]) => {
          dispatch(setCurrencyMetadata(currencyRes));
          
          const typesMap = stockRes["typesMap"];

          const tickersFiltered: StockMetadata[] = [];
          Object.keys(typesMap).forEach(ticker => {
            const stockData = typesMap[ticker];


            tickersFiltered.push({
              symbol: ticker,
              type: stockData.type,
              name: stockData.name,
            });
            
          });
          dispatch(setStockMetadata(tickersFiltered));
        })
        .catch((err) => {
          console.error('Fetch error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [stockAssetFromState, currencyAsset, symbol]);

  return (
    <div className="min-h-screen w-full bg-background">
    {
        symbol && !loading && (stockAssetFromState || currencyAsset)?
        <div className="m-8">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            {stockAssetFromState
              ? `${stockAssetFromState.symbol || symbol} `
              : currencyAsset
              ? `${currencyAsset} currency to USD `
              : symbol
            } Overview</h2>
            <div className="mb-8">
              <AssetInfo currentData={currentData} name={stockAssetFromState?.name || symbol} symbol={stockAssetFromState?.symbol || symbol} type={stockAssetFromState?.type || 'Currency'}/>
            </div>
            <FinancialChart
              symbol={symbol}
              chartType={chartType}
              soloMode={true}
          /> 
        </div>
        : (
            <div className="flex justify-center items-center h-40">
                <Spinner/>
            </div>
        )
    }
    </div>
  );
};
