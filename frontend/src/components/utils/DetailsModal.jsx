import React, { useState } from "react";
import { Box, Typography, Modal, Stack, Divider, TextField, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AxiosCalendarInstance from "../AxiosCalendarInstance";
import MyButton from "../forms/MyButton";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function DetailsModal({ open, onClose, eventDetails = {}, loading, onEdit }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const startDate = eventDetails?.start ? dayjs(eventDetails.start).format("DD/MM/YYYY") : "";
  const endDate = eventDetails?.end ? dayjs(eventDetails.end).format("DD/MM/YYYY") : "";
  const startTime = eventDetails?.start ? dayjs(eventDetails.start).format("HH:mm") : "";
  const endTime = eventDetails?.end ? dayjs(eventDetails.end).format("HH:mm") : "";

  const sameDate = startDate === endDate;
  const differentTimes = startTime !== endTime;

  // Open delete confirmation modal
  const handleDeleteClick = () => {
    setEventToDelete(eventDetails);
    setOpenDeleteModal(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (!eventToDelete) return;

    AxiosCalendarInstance.delete(`tasksevents/${eventToDelete.id}/?owner=${localStorage.getItem("user_id")}`)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setOpenDeleteModal(false);
        setEventToDelete(null);
      });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="event-details">
      <Box sx={style}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {eventDetails?.title || "Untitled Event"}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {sameDate ? (
                differentTimes ? (
                  <>
                    <TextField
                      label="Date"
                      value={startDate}
                      InputProps={{
                        startAdornment: <EventIcon sx={{ mr: 1 }} />,
                        readOnly: true,
                      }}
                      fullWidth
                    />
                    <Box display="flex" gap={2}>
                      <TextField
                        label="Start Time"
                        value={startTime}
                        InputProps={{
                          startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
                          readOnly: true,
                        }}
                        fullWidth
                      />
                      <TextField
                        label="End Time"
                        value={endTime}
                        InputProps={{
                          startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
                          readOnly: true,
                        }}
                        fullWidth
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <TextField
                      label="Date"
                      value={startDate}
                      InputProps={{
                        startAdornment: <EventIcon sx={{ mr: 1 }} />,
                        readOnly: true,
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Time"
                      value={startTime}
                      InputProps={{
                        startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </>
                )
              ) : (
                <>
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Start Date"
                      value={startDate}
                      InputProps={{
                        startAdornment: <EventIcon sx={{ mr: 1 }} />,
                        readOnly: true,
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Start Time"
                      value={startTime}
                      InputProps={{
                        startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box display="flex" gap={2}>
                    <TextField
                      label="End Date"
                      value={endDate}
                      InputProps={{
                        startAdornment: <EventIcon sx={{ mr: 1 }} />,
                        readOnly: true,
                      }}
                      fullWidth
                    />
                    <TextField
                      label="End Time"
                      value={endTime}
                      InputProps={{
                        startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Box>
                </>
              )}

              <TextField
                label="Description"
                value={eventDetails?.description || "No Description"}
                multiline
                minRows={3}
                InputProps={{ readOnly: true }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <MyButton label="Edit" icon={<EditIcon />} type="button" onClick={onEdit} />
              <MyButton
                label="Delete"
                icon={<DeleteForeverIcon />}
                type="button"
                onClick={handleDeleteClick}
                sx={{ backgroundColor: "red", "&:hover": { backgroundColor: "darkred" } }}
              />
            </Stack>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {eventToDelete && (
          <ConfirmDeleteModal
            open={openDeleteModal}
            itemName={eventToDelete?.title || "this event"}
            onConfirm={confirmDelete}
            onCancel={() => setOpenDeleteModal(false)}
          />
        )}
      </Box>
    </Modal>
  );
}
