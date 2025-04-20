import { Div } from "@jumbo/shared";
import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

interface BackdropSpinnerProps {
  message?: string;
}

export const BackdropSpinner: React.FC<BackdropSpinnerProps> = (props) => {
  return (
    <Backdrop
      sx={{ 
        color: '#ffffff', 
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
      open={true}
    >
      <CircularProgress color="primary" />
      {props?.message && (
        <Div sx={{ p: 2 }}>
          <h2>{props.message}</h2>
        </Div>
      )}
    </Backdrop>
  );
};