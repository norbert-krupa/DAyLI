import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Modal, Stack, Divider } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MyTextForm from "../forms/MyTextForm";
import MyButton from "../forms/MyButton";
import MyMultilineTextField from "../forms/MyMultilineTextField";
import MyDatePicker from "../forms/MyDatePicker";
import MyTimePicker from "../forms/MyTimePicker";
import MyDropdown from "../forms/MyDropdown";
import AxiosCalendarInstance from "../AxiosCalendarInstance";
import dayjs from "dayjs";

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

export default function CreateModal({
  open,
  handleClose,
  selectedDate,
  formData,
  setFormData,
  handleChange,
}) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    AxiosCalendarInstance.get(`taskeventgroups/?owner=${localStorage.getItem("user_id")}`)
      .then((response) => setGroups(response.data))
      .catch((error) => {
        console.log("Error fetching groups", error);
        setGroups([]);
      });
  }, []);

  useEffect(() => {
    if (open) {
      const selectedDay = selectedDate ? dayjs(selectedDate) : dayjs();
      setFormData((prev) => ({
        ...prev,
        start: selectedDay.toISOString(),
        end: selectedDay.toISOString(),
      }));
    }
  }, [open, selectedDate, setFormData]);

  const handleStartTimeChange = (name, newValue) => {
    setFormData((prev) => ({
      ...prev,
      start: newValue ? newValue.toISOString() : prev.start,
      end: newValue ? newValue.toISOString() : prev.start,
    }));
  };

  const submission = (event) => {
    event.preventDefault();
    AxiosCalendarInstance.post(`tasksevents/`, {
      title: formData.title,
      start: formData.start ? dayjs(formData.start).toISOString() : null,
      end: formData.end ? dayjs(formData.end).toISOString() : null,
      group: formData.group || null,
      description: formData.description || null,
      owner: localStorage.getItem("user_id"),
    })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="create-event-modal">
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {dayjs(selectedDate).format("dddd - DD/MM/YYYY")}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <form onSubmit={submission}>
          <Stack spacing={2}>
            <MyTextForm label="Title" name="title" value={formData.title} onChange={handleChange} />

            <MyDatePicker
              label="End Date"
              name="end"
              value={formData.end ? dayjs(formData.end) : dayjs(formData.start)}
              onChange={(name, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  end: newValue ? newValue.toISOString() : prev.start,
                }));
              }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <MyTimePicker
                label="Start Time"
                name="start"
                value={formData.start ? dayjs(formData.start) : dayjs(selectedDate)}
                onChange={handleStartTimeChange}
                ampm={false}
              />
              <MyTimePicker
                label="End Time"
                name="end"
                value={formData.end ? dayjs(formData.end) : dayjs(formData.start)}
                onChange={(name, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    end: newValue ? newValue.toISOString() : prev.end,
                  }));
                }}
                ampm={false}
              />
            </Box>

            <MyDropdown
              label="Group"
              name="group"
              value={formData.group || ""}
              onChange={(event) => setFormData({ ...formData, group: event.target.value })}
              options={groups}
            />

            <MyMultilineTextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <MyButton label="Create" icon={<AddCircleIcon />} type="submit" />
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
