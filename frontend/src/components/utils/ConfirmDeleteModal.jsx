import React from "react";
import { Modal, Box, Typography, Stack } from "@mui/material";
import MyButton from "../forms/MyButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  textAlign: "center",
};

const ConfirmDeleteModal = ({ open, itemName, onConfirm, onCancel }) => {
  return (
    <Modal open={open} onClose={onCancel} aria-labelledby="confirm-delete-modal">
      <Box sx={style}>
        <Typography variant="h6" fontWeight="bold">
          Are you sure you want to delete "{itemName}"?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <MyButton label="Yes" onClick={onConfirm} sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}/>
          <MyButton label="No" onClick={onCancel} />
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
