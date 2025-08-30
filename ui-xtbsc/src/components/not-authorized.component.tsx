import { Alert } from "@heroui/react";


export const NotAuthorized: React.FC = () => {


  return (
          <Alert
        hideIconWrapper
        color="danger"
        description="You are not authorized to view this page."
        title="Not Authorized"
        variant="bordered"
      />
  );
}