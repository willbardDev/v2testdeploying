import { Backdrop } from "@mui/material";
import React from "react";
import { Div } from "@jumbo/shared";
import Image from "next/image";

interface BackdropSpinnerProps {
  message?: string;
  isRouterTransfer?: boolean;
}

export const BackdropSpinner: React.FC<BackdropSpinnerProps> = ({
  message,
  isRouterTransfer,
}) => {
  return (
    <Backdrop
      sx={{
        color: "#ffffff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: "column",
      }}
      open={true}
    >
      <Div
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
          mb: 2,
          position: "relative"
        }}
      >
        <Image
          src={`/assets/images/logos/proserp-logo.jpeg`}
          alt="ProsERP"
          width={48}
          height={48}
        />
      </Div>
      {message && (
        <Div sx={{ p: 2 }}>
          <h2>{message}</h2>
        </Div>
      )}
    </Backdrop>
  );
};
