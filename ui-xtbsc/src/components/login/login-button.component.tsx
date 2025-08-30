import React, { useEffect, useRef, useState } from "react";
import {Button} from "@heroui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useApiClient } from "../../api-client";
import { useNavigate } from "react-router-dom";

export const LoginButton: React.FC = () => {
  const didCreateUser = useRef(false);
  const navigate = useNavigate();
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading  } = useAuth0();
  const { apiPostAuthenticated } = useApiClient();


  const handleAuth = () => {
    if(!isAuthenticated) {
      loginWithRedirect()
    } else{
       logout({ logoutParams: { returnTo: window.location.origin } })
    }
  };

  useEffect(() => {
    const createUser = async () => {
      if (isAuthenticated && user && !didCreateUser.current) {
        try {
          await apiPostAuthenticated("http://localhost:8080/user", {});
          console.log("User created/updated:");
          didCreateUser.current = true;
        } catch (err) {
          console.error("Error creating user:", err);
        }
      }
    };

    createUser();
  }, [isAuthenticated ]);

  return (
    <span>
    {(isAuthenticated && user && !isLoading) ? 
      <Button className="mr-2" onPress={() => navigate(`/user`)}>
        <span className="flex items-center">
          {user?.email}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 ml-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>

        </span>
      </Button> : ""
    }
    <Button
      className=""
      onPress={handleAuth}
       variant="bordered"
    >
      <span className="mr-1">{isAuthenticated ? "Logout" : "Log in"}</span>
    
    <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    </span>    

    </Button>
    </span>
  );
};