import {React, useState, useEffect} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AxiosCalendarInstance from '../AxiosCalendarInstance';
import MyButton from '../forms/MyButton';

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



export default function DetailsModal({open, onClose, eventDetails, loading, onEdit}) {

    const handleDelete = () => {
        if(!eventDetails || !eventDetails.id) {
            console.log("Event not found")
            return
        }
        AxiosCalendarInstance.delete(`tasksevents/${eventDetails.id}/`)
        .then((response) => {
            console.log(response)
            window.location.reload()
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return(
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {loading ? <p> </p> :
                <>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontWeight:'bold'}}>
                            {eventDetails.title}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Box>
                                <Box sx={{fontWeight:'bold'}}>Start date: </Box>
                                <Box sx={{marginLeft:'10px'}}>{eventDetails.start}</Box>
                            </Box>
                            <Box>
                                <Box sx={{fontWeight:'bold'}}>End date: </Box>
                                <Box sx={{marginLeft:'10px'}}>{eventDetails.end}</Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <MyButton label="Edit" type="button" onClick={onEdit} />
                                <MyButton label="Delete" type="button" onClick={handleDelete} sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}/>
                            </Box>
                        </Typography>
                    </Box>
                </>
                }

            </Modal>
        </div>
    )

}