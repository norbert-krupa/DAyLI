import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import Calendar from "./Calendar";
import AxiosCalendarInstance from "./AxiosCalendarInstance";
import CreateModal from "./utils/CreateModal";
import DetailsModal from "./utils/DetailsModal";
import EditModal from "./utils/EditModal";
import MyChipDropdown from "./forms/MyChipDropdown";
import tinycolor from "tinycolor2";
import dayjs from "dayjs";
import "../App.css";

const Home = () => {
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedDate, setSelectedDate] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        start: null,
        end: null
    });

    const [open, setOpen] = useState(false);
    const handleOpen = (info) => {
        setOpen(true);
        setSelectedDate(info.dateStr);

        const clickedTimestamp = dayjs(info.dateStr).isValid() ? dayjs(info.dateStr) : null;

        setFormData({
            title: "",
            classNames: "",
            start: clickedTimestamp ? clickedTimestamp.toISOString() : dayjs().toISOString(),
            end: clickedTimestamp ? clickedTimestamp.toISOString() : dayjs().toISOString(),
            description: "",
            group: "",
        });
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            title: "",
            start: null,
            end: null
        });
    };

    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [eventDetails, setEventDetails] = useState([]);
    const [eventDetailsLoading, setEventDetailsLoading] = useState(true);

    const handleOpenDetails = (data) => {
        setOpenDetailsModal(true);
        AxiosCalendarInstance.get(`tasksevents/${data.event.id}/?owner=${localStorage.getItem("user_id")}`)
            .then((response) => {
                setEventDetails(response.data);
                setEventDetailsLoading(false);
            });
    };

    const handleCloseDetails = () => {
        setOpenDetailsModal(false);
        setEventDetails([]);
        setEventDetailsLoading(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const [openEditModal, setOpenEditModal] = useState(false);

    const handleOpenEdit = () => {
        setOpenDetailsModal(false);
        setOpenEditModal(true);
    };

    const handleCloseEdit = () => {
        setOpenEditModal(false);
    };

    const [loading, setLoading] = useState(true);

    const darkenColor = (color, amount = 20) => {
        return tinycolor(color).darken(amount).toString();
    };

    const getTextColor = (bgColor) => {
        return tinycolor(bgColor).isLight() ? "#000000" : "#FFFFFF";
    };

    const GetData = async () => {
        try {
            const eventsResponse = await AxiosCalendarInstance.get(`tasksevents/?owner=${localStorage.getItem("user_id")}`);
            const fetchedEvents = eventsResponse.data;

            const groupsResponse = await AxiosCalendarInstance.get(`taskeventgroups/?owner=${localStorage.getItem("user_id")}`);
            const fetchedGroups = groupsResponse.data;

            setGroups(fetchedGroups);

            const formattedEvents = fetchedEvents.map((event) => {
                const eventGroup = fetchedGroups.find(group => group.events.includes(event.id));

                const backgroundColor = eventGroup ? eventGroup.group_color : "#999999";
                const borderColor = darkenColor(backgroundColor, 25);
                const textColor = getTextColor(backgroundColor);

                return {
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    allDay: false,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    textColor: textColor,
                    groupId: eventGroup ? eventGroup.id : null,
                };
            });

            setEvents(formattedEvents);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        GetData();
    }, []);

    const filteredEvents = selectedGroups.length
        ? events.filter(event => selectedGroups.includes(event.groupId))
        : events;

    return (
        <div>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <CreateModal
                        open={open}
                        handleClose={handleClose}
                        selectedDate={selectedDate}
                        formData={formData}
                        setFormData={setFormData}
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

                    <Box sx={{ boxShadow: 3, padding: "20px", display: "flex", justifyContent: "space-between", borderRadius: 2, marginBottom: "20px" }}>
                        <MyChipDropdown
                            label="Filter by Group"
                            name="groupFilter"
                            value={selectedGroups}
                            onChange={(name, value) => setSelectedGroups(value)}
                            options={groups.map(group => ({
                                label: group.name,
                                value: group.id,
                                color: group.group_color,
                            }))}
                        />
                    </Box>

                    <Calendar
                        myEvents={filteredEvents}
                        dateClickAction={handleOpen}
                        eventClickAction={handleOpenDetails}
                    />
                </>
            )}
        </div>
    );
};

export default Home;
