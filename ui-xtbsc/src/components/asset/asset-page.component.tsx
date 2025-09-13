import { useParams } from "react-router-dom";
import { fetchMetadata, useAppDispatch } from "../../state/metadata-reducer";
import { useSelector } from "react-redux";
import { RootState } from "../../state/redux-configurator";
import { useEffect, useState } from "react";
import { ChartType } from "../../interfaces/enums";
import { AssetInfo } from "./asset-info.component";
import { AssetBalance } from "../balance/asset-balance.component";
import { FinancialChart } from "../common/financial-chart.component";
import { Spinner } from "@heroui/react";


export const AssetPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { symbol } = useParams<{ symbol: string; }>();
  const stockMetadata = useSelector((state: RootState) => state.metadata.stockMetadata);
  const currencyMetadata = useSelector((state: RootState) => state.metadata.currencyMetadata);
  const currentData = useSelector((state: RootState) => state.currentData.currentData);

  const [loading, setLoading] = useState(false);

  const stockAssetFromState = stockMetadata.find(item => item.symbol === symbol);

  const currencyAsset = currencyMetadata.find(item => item === symbol);

  const chartType = stockAssetFromState ? ChartType.STOCK : ChartType.CURRENCY;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [symbol]);

  useEffect(() => {
    dispatch(fetchMetadata());
  }, [dispatch]);

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
            <div className="mb-8 flex flex-row justify-between">
              <AssetInfo currentData={currentData} name={stockAssetFromState?.name || symbol} symbol={stockAssetFromState?.symbol || symbol} type={stockAssetFromState?.type || 'Currency'}/>
              <AssetBalance currentData={currentData} symbol={stockAssetFromState?.symbol || symbol} type={stockAssetFromState?.type || 'Currency'}/>
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
