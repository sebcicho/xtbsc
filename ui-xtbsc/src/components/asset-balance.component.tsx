import { useAuth0 } from "@auth0/auth0-react";
import { DataPoint } from "../interfaces/data-point";
import { useEffect, useState } from "react";
import { useApiClient } from "../api-client";
import { currenciesMap } from "../interfaces/currencies-map";
import { AssetDto } from "../interfaces/asset-dto";

interface AssetBalanceProps {
  currentData: DataPoint[],
  symbol: string,
  type: string,
}


export const AssetBalance: React.FC<AssetBalanceProps> = ({ currentData, symbol, type }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { apiFetchAuthenticated } = useApiClient();
    const [assetUserDetails, setAssetUserDetails] = useState<AssetDto[] | null>(null);

    const units = assetUserDetails?.[0]?.quantity ? assetUserDetails[0].quantity || 0 : 0;
    const heldValue = assetUserDetails?.[0]?.quantity ? assetUserDetails[0].quantity * assetUserDetails[0].price : 0;

    const fetchAssetUserDetails = async () => {
          const res = await apiFetchAuthenticated("http://localhost:8080/user/asset?symbol=" + symbol);
          const data = await res.json();
          setAssetUserDetails(data);
      };
      
      useEffect(() => {
        if(isAuthenticated && user) {
            fetchAssetUserDetails();
        }
      }, [isAuthenticated, user]);

    return (isAuthenticated && user && assetUserDetails) ?
        <div>
            <p className="font-semibold mb-1">
                    Units: <span className="font-bold">{units}</span>
            </p>
            <p className="font-semibold mb-1">
                    Held value: <span className="font-bold">{`${heldValue} ${type==='Currency' ? currenciesMap[symbol] ?? symbol : '$'}`}</span>
            </p>
        </div> 
        : null;
}