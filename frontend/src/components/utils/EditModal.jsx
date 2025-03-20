import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, Stack, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import MyTextForm from '../forms/MyTextForm';
import MyButton from '../forms/MyButton';
import MyMultilineTextField from '../forms/MyMultilineTextField';
import MyDatePicker from '../forms/MyDatePicker';
import MyTimePicker from '../forms/MyTimePicker';
import MyDropdown from '../forms/MyDropdown';
import AxiosCalendarInstance from '../AxiosCalendarInstance';
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function EditModal({ open, onClose, eventDetails, setEvents }) {
  const [formData, setFormData] = useState({
    title: '',
    start: null,
    end: null,
    group: '',
    description: '',
  });

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (eventDetails) {
      setFormData({
        title: eventDetails.title || '',
        start: eventDetails.start ? dayjs(eventDetails.start).toISOString() : null,
        end: eventDetails.end ? dayjs(eventDetails.end).toISOString() : null,
        group: eventDetails.group || '',
        description: eventDetails.description || '',
      });
    }
  }, [eventDetails]);

  useEffect(() => {
    AxiosCalendarInstance.get(`taskeventgroups/?owner=${localStorage.getItem("user_id")}`)
      .then((response) => setGroups(response.data))
      .catch((error) => {
        console.log("Error fetching groups", error);
        setGroups([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value.toISOString() : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AxiosCalendarInstance.put(`tasksevents/${eventDetails.id}/?owner=${localStorage.getItem('user_id')}`, {
        title: formData.title,
        start: formData.start,
        end: formData.end,
        group: formData.group || null,
        description: formData.description || null,
    })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating event:', error);
        alert('Failed to update the event. Please try again.');
      });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-event-modal">
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Event
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <MyTextForm label="Title" name="title" value={formData.title} onChange={handleChange} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <MyDatePicker
                label="Start Date"
                name="start"
                value={formData.start ? dayjs(formData.start) : null}
                onChange={handleDateChange}
              />
              <MyTimePicker
                label="Start Time"
                name="start"
                value={formData.start ? dayjs(formData.start) : null}
                onChange={handleDateChange}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <MyDatePicker
                label="End Date"
                name="end"
                value={formData.end ? dayjs(formData.end) : dayjs(formData.start)}
                onChange={handleDateChange}
              />
              <MyTimePicker
                label="End Time"
                name="end"
                value={formData.end ? dayjs(formData.end) : dayjs(formData.start)}
                onChange={handleDateChange}
              />
            </Box>

            <MyDropdown
              label="Group"
              name="group"
              value={formData.group || ""}
              onChange={(event) => setFormData({ ...formData, group: event.target.value })}
              options={groups}
            />

            <MyMultilineTextField label="Description" name="description" value={formData.description} onChange={handleChange} />
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <MyButton label="Save" icon={<SaveIcon />} type="submit" />
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
