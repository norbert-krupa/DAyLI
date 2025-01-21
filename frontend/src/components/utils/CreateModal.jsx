import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MyTextForm from '../forms/MyTextForm';
import MyButton from '../forms/MyButton';
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

export default function CreateModal({open, handleClose, selectedDate, formData, handleChange}) {

    const StartDate = formData.start ? dayjs(formData.start.$d).format('YYYY-MM-DD') : null
    const EndDate = formData.end ? dayjs(formData.end.$d).format('YYYY-MM-DD') : null
  

    const submission = (event) => {
        event.preventDefault()
        AxiosCalendarInstance.post(`tasksevents/`, {
          title: formData.title,
          start: StartDate,
          end: EndDate
        })
        .then(res => {
          console.log(res)
          window.location.reload()
        }
        )

    }

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontWeight:'bold'}}>
                  {selectedDate}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <form onSubmit={submission}>
                      <Box sx={{marginBottom:'20px'}}>
                          <MyTextForm
                              label={"Title"}
                              name={"title"}
                              value={formData.title}
                              onChange={handleChange}
                          />
                      </Box>
                      <Box sx={{marginBottm:'20px'}}>
                          <MyButton
                              label={"Add"}
                              type={"submit"}
                          />
                      </Box>
                  </form>
            </Typography>
          </Box>
        </Modal>
      </div>
    );
}