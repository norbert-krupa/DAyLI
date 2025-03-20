import React, { useEffect } from "react";
import { Box, Typography, Modal, Stack, Divider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
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

export default function EditGroupModal({ open, handleClose, groupData, refreshGroups }) {
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
      name: groupData?.name || "",
      description: groupData?.description || "",
      color: groupData?.group_color || "#3788d8",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (open && groupData) {
      reset({
        name: groupData.name || "",
        description: groupData.description || "",
        color: groupData.group_color || "#3788d8",
      });
    }
  }, [open, groupData, reset]);

  const onSubmit = (values) => {
    AxiosCalendarInstance.put(`taskeventgroups/${groupData.id}/?owner=${localStorage.getItem("user_id")}`, {
      name: values.name,
      description: values.description,
      group_color: values.color,
    })
      .then(() => {
        refreshGroups();
        handleClose();
      })
      .catch((error) => {
        console.error("Error updating group:", error);
      });
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-group-modal">
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Group
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
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <MyButton label="Save" icon={<SaveIcon />} type="submit" />
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
