import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button } from "@mui/material";
import React from "react";
import { ComposeForm } from "../ComposeForm";
import { FiltersList } from "./FiltersList";
import { FoldersList } from "./FoldersList";
import { LabelsList } from "./LabelsList";

const MailAppSidebar = () => {
  const { showDialog } = useJumboDialog();
  const handleComposeForm = React.useCallback(() => {
    showDialog({
      title: "Compose Message",
      content: <ComposeForm />,
    });
  }, [showDialog]);

  return (
    <React.Fragment>
      <Button
        fullWidth
        disableElevation
        variant={"contained"}
        startIcon={<EditOutlinedIcon />}
        sx={{
          mb: 4,
          "& .MuiSvgIcon-root": {
            fontSize: "1.5rem",
          },
        }}
        onClick={handleComposeForm}
      >
        Compose
      </Button>
      <FoldersList />
      <FiltersList />
      <LabelsList />
    </React.Fragment>
  );
};
export { MailAppSidebar };
