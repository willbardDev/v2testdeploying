'use client';

import { Backdrop } from "@mui/material";
import React from "react";
import { Div } from "@jumbo/shared";
import Image from "next/image";
import { keyframes } from "@emotion/react";

interface BackdropSpinnerProps {
  message?: string;
  isRouterTransfer?: boolean;
}

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const BackdropSpinner: React.FC<BackdropSpinnerProps> = ({
  message,
  isRouterTransfer
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
          width: 100,
          height: 100,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
          mb: 2,
          animation: `${rotate} 1.5s linear infinite`,
        }}
      >
        <Image
          src="/assets/images/logos/proserp-logo.jpeg"
          alt="ProsERP"
          width={95}
          height={95}
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </Div>

      {!isRouterTransfer && message && (
        <Div sx={{ p: 2 }}>
          <h2>{message}</h2>
        </Div>
      )}
    </Backdrop>
  );
};
