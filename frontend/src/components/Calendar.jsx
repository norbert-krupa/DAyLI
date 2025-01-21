import {React} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'

const Calendar = ({myEvents, dateClickAction, eventClickAction}) => {

    return(
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            firstDay={1}
            events={myEvents}
            eventClick = {eventClickAction}
            dateClick = {dateClickAction}

            headerToolbar={{
                left: 'listMonth,timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear',
                center: 'title',
                right: 'prev,next'

            }}
        />
    )
}

export default Calendar