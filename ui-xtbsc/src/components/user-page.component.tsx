import { useAuth0 } from "@auth0/auth0-react";
import { NotAuthorized } from "./login/not-authorized.component";
import { Spinner } from "@heroui/react";
import { useApiClient } from "../api-client";
import { useEffect, useState } from "react";
import { AccountBalance } from "./balance/account-balance.component";
import { AssetsSummary } from "./balance/assets-summary.component";


export const UserPage: React.FC = () => {
  const { user, isAuthenticated, isLoading   } = useAuth0();
  const [userDetails, setUserDetails] = useState<any>(null);
  const { apiFetchAuthenticated } = useApiClient();
  
  const fetchUserDetails = async () => {
      const res = await apiFetchAuthenticated("http://localhost:8080/user");
      const data = await res.json();
      setUserDetails(data);
  };
  
  useEffect(() => {
    fetchUserDetails();
  }, []);

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="min-h-screen w-full bg-background">
      {(isLoading ? 
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div> : 
        (isAuthenticated && user) ?
          <div className="m-8">
            <h1 className="text-2xl font-bold mb-8 text-foreground">Your Dashboard</h1>
            <div className="mb-8">
              <AccountBalance assets={userDetails?.assets || []} onFundsAdded={() => {
                  fetchUserDetails();
              }} />
            </div>
            <div className="mb-8">
              <AssetsSummary assets={userDetails?.assets || []} />
            </div>
          </div> :
          <NotAuthorized />
      )}
    </div>
    
  );
}