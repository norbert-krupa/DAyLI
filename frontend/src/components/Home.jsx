import {React, useEffect, useState} from 'react'
import Calendar from './Calendar'
import AxiosCalendarInstance from './AxiosCalendarInstance'
import CreateModal from './utils/CreateModal'
import DetailsModal from './utils/DetailsModal'
import EditModal from './utils/EditModal'
import dayjs from 'dayjs'
import '../App.css'


const Home = () => {

    const [events, setEvents] = useState([])
    const [selectedDate, setSelectedDate] = useState([])
    const [formData, setFormData] = useState({
        title: '',
        start: null,
        end: null
    })


    const [open, setOpen] = useState(false);
    const handleOpen = (info) => {
        setOpen(true)
        setSelectedDate(info.dateStr)
        setFormData({
            title: '',
            classNames: '',
            start: dayjs(info.dateStr),
            end: dayjs(info.dateStr)
        })
    }

    const handleClose = () => {
        setOpen(false)
        setFormData({
            title: '',
            start: null,
            end: null
        })
    }

    const [openDetailsModal, setOpenDetailsModal] = useState(false)
    const [eventDetails, setEventDetails] = useState([])
    const [eventDetailsLoading, setEventDetailsLoading] = useState(true)
    const handleOpenDetails = (data) => {
        setOpenDetailsModal(true)
        AxiosCalendarInstance.get(`tasksevents/${data.event.id}`)
        .then((response) => {
            setEventDetails(response.data)
            setEventDetailsLoading(false)
        })
     
    }

    const handleCloseDetails = () => {
        setOpenDetailsModal(false)
        setEventDetails([])
        setEventDetailsLoading(true)
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const [openEditModal, setOpenEditModal] = useState(false);

    const handleOpenEdit = () => {
        setOpenDetailsModal(false);
        setOpenEditModal(true);
    };
    
    const handleCloseEdit = () => {
        setOpenEditModal(false);
    };
    


    const [loading, setLoading] = useState(true)

    const GetData = () => {
        AxiosCalendarInstance.get(`tasksevents/?owner=${localStorage.getItem('user_id')}/`)
        .then((response) => {
            setEvents(response.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        GetData()
    }, [])

    return(
        <div>
            {loading ? <p> </p> :
            <>
                <CreateModal
                    open={open}
                    handleClose={handleClose}
                    selectedDate={selectedDate}
                    formData={formData}
                    handleChange={handleChange}
                />
                <DetailsModal
                    open={openDetailsModal}
                    onClose={handleCloseDetails}
                    eventDetails={eventDetails}
                    loading={eventDetailsLoading}
                    onEdit={handleOpenEdit}
                />

                <EditModal
                    open={openEditModal}
                    onClose={handleCloseEdit}
                    eventDetails={eventDetails}
                    setEvents={setEvents}
                />

                <Calendar
                    myEvents={events}
                    dateClickAction={handleOpen}
                    eventClickAction={handleOpenDetails}
                />
            </>    
            }
        </div>
    )
}

export default Home