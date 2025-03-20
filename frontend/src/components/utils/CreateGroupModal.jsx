import React, { useEffect } from "react";
import { Box, Typography, Modal, Stack, Divider } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { SketchPicker } from "react-color";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MyTextForm from "../forms/MyTextForm";
import MyButton from "../forms/MyButton";
import MyMultilineTextField from "../forms/MyMultilineTextField";
import AxiosCalendarInstance from "../AxiosCalendarInstance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const validationSchema = yup.object({
  name: yup.string().required("Group Name is required"),
  color: yup.string().required("Color is required"),
});

export default function CreateGroupModal({ open, handleClose, refreshGroups }) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3788d8",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (open) {
      reset({ name: "", description: "", color: "#3788d8" });
    }
  }, [open, reset]);

  const onSubmit = (values) => {
    AxiosCalendarInstance.post(`taskeventgroups/`, {
      name: values.name,
      description: values.description,
      group_color: values.color,
      owner: localStorage.getItem("user_id"),
    })
      .then(() => {
        refreshGroups();
        handleClose();
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="create-group-modal">
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create New Group
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <MyTextForm
                  label="Group Name"
                  {...field}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => <MyMultilineTextField label="Description" {...field} />}
            />

            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <SketchPicker
                color={selectedColor}
                onChange={(color) => setValue("color", color.hex)}
                width="100%"
              />
            </Box>
            {errors.color && (
              <Typography color="error" variant="body2">
                {errors.color?.message}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <MyButton label="Create" icon={<AddCircleIcon />} type="submit" />
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
