import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";

const Calendar = ({ myEvents, dateClickAction, eventClickAction }) => {
    const storedView = localStorage.getItem("calendarView") || "timeGridWeek";
    const [calendarView, setCalendarView] = useState(storedView);
    const calendarRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("calendarView", calendarView);

        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(calendarView);
        }
    }, [calendarView]);

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin, interactionPlugin]}
            initialView={calendarView}
            eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }}
            eventContent={(arg) => {
                const isTimeGridView = arg.view.type === "timeGridDay" || arg.view.type === "timeGridWeek" || arg.view.type === "multiMonthYear";
                return {
                    html: isTimeGridView
                        ? `<b>${arg.event.title}</b>`
                        : `<b>${arg.timeText.toUpperCase()}</b> ${arg.event.title}`,
                };
            }}
            firstDay={1}
            events={myEvents}
            eventClick={eventClickAction}
            dateClick={dateClickAction}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            eventDisplay="block"
            eventOverlap={true}
            slotEventOverlap={false}
            eventOrder="start,-duration,title"
            nowIndicator={true}
            allDaySlot={false}
            headerToolbar={{
                left: "listMonth,timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear",
                center: "title",
                right: "prev,today,next",
            }}
            viewDidMount={(view) => {
                setCalendarView(view.view.type);
            }}
            datesSet={(view) => {
                setCalendarView(view.view.type);
            }}
        />
    );
};

export default Calendar;
