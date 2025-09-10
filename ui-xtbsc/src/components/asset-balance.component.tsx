import { useAuth0 } from "@auth0/auth0-react";
import { DataPoint } from "../interfaces/data-point";
import { useEffect, useState } from "react";
import { useApiClient } from "../api-client";

interface AssetBalanceProps {
  currentData: DataPoint[],
  symbol: string,
}


export const AssetBalance: React.FC<AssetBalanceProps> = ({ currentData, symbol }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { apiFetchAuthenticated } = useApiClient();
    const [assetUserDetails, setAssetUserDetails] = useState<any>(null);

    const currentPrice = Number(currentData[currentData.length - 1]?.[symbol]);


    const fetchAssetUserDetails = async () => {
          const res = await apiFetchAuthenticated("http://localhost:8080/user");
          const data = await res.json();
          setAssetUserDetails(data);
      };
      
      useEffect(() => {
        fetchAssetUserDetails();
      }, []);

    return (isAuthenticated && user && assetUserDetails) ?
        <div>Asset Balance Component</div> 
        : null;
}