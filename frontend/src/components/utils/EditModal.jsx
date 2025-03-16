import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MyTextForm from '../forms/MyTextForm';
import MyButton from '../forms/MyButton';
import MyDatePicker from '../forms/MyDatePicker';
import AxiosCalendarInstance from '../AxiosCalendarInstance';
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function EditModal({ open, onClose, eventDetails, setEvents }) {
  const [formData, setFormData] = useState({
    title: '',
    start: null,
    end: null,
  });

  // Pre-fill the formData with eventDetails when modal is opened
  useEffect(() => {
    if (eventDetails) {
      setFormData({
        title: eventDetails.title || '',
        start: eventDetails.start ? dayjs(eventDetails.start) : null,
        end: eventDetails.end ? dayjs(eventDetails.end) : null,
      });
    }
  }, [eventDetails]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle date picker changes
  const handleDateChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit updated event data
  const handleSubmit = (e) => {
    e.preventDefault();
    AxiosCalendarInstance.put(`tasksevents/${eventDetails.id}/?owner=${localStorage.getItem('user_id')}/`, {
        title: formData.title,
        start: formData.start ? dayjs(formData.start).format('YYYY-MM-DD') : null,
        end: formData.end ? dayjs(formData.end).format('YYYY-MM-DD') : null,
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
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Edit Event
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              {/* Title Input */}
              <Box sx={{ marginBottom: '20px' }}>
                <MyTextForm
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Box>

              {/* Start Date Picker */}
              <Box sx={{ marginBottom: '20px' }}>
                <MyDatePicker
                  label="Start Date"
                  value={formData.start}
                  onChange={handleDateChange}
                  name="start"
                />
              </Box>

              {/* End Date Picker */}
              <Box sx={{ marginBottom: '20px' }}>
                <MyDatePicker
                  label="End Date"
                  value={formData.end}
                  onChange={handleDateChange}
                  name="end"
                />
              </Box>

              {/* Buttons */}
              <Box>
                <MyButton label="Save" type="submit" sx={{ marginLeft: '10px' }} />
              </Box>
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
