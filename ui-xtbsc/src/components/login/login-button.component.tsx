import React, { useEffect, useState } from "react";
import {Button} from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useApiClient } from "../../api-client";

export const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<any>(null);
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, getAccessTokenSilently  } = useAuth0();
  const { apiFetchAuthenticated } = useApiClient();

  const requestUser = async () => {
    const res = await apiFetchAuthenticated("http://localhost:8080/user");
    const data = await res.json();
    setUserDetails(data);
  };

  const handleAuth = () => {
    if(!isAuthenticated) {
      loginWithRedirect()
    } else{
       logout({ logoutParams: { returnTo: window.location.origin } })
    }
  };

  return (
    <span>
      <Button onPress={requestUser}>Get user</Button>
    <Button
      className=""
      onPress={handleAuth}
       variant="bordered"
    >
      <span className="mr-2">{isAuthenticated ? "Logout" : "Log in"}</span>
    
    <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    </span>    

    </Button>
    </span>
  );
};