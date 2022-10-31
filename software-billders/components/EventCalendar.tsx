import {Button} from "semantic-ui-react";
import {atcb_action} from "add-to-calendar-button";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
//import "./Calendar.css";
import moment from 'moment'
import AddToCalendar from "./AddToCalendar";

const localizer = momentLocalizer(moment)
const parseDateTime = function(dateTime:string) {
  dateTime = dateTime.substring(0, dateTime.lastIndexOf(',')) + dateTime.substring(dateTime.lastIndexOf(',') + 1);
  // console.log("Workss: " + moment().toDate())
  // console.log("Workss: " + moment().add(1, "days").toDate())
  // console.log("Actual: " + moment(dateTime, "LLLL").toDate())
  // console.log("Actual: " + moment(dateTime, "LLLL").add(1, 'days').toDate())
  // console.log("=======")
  return moment(dateTime, "LLLL")
}

// @ts-ignore
const EventCalendar = ( { events } ) => {

  // const measureHearing: string = `${document.data().measureType}-${document.data().measureNumber}`;
  const allEvents = events?.map((event) => {
      //"Thursday, February 10, 2022 2:00 pm"
      // return {start: parseDateTime(event.data().datetime).toDate(), end: moment(parseDateTime(event.data().datetime)).add(1, 'days').toDate(), title: event.data().measureNumber}
      //return {start: moment().toDate(), end: moment().add(1, "days").toDate(), title: event.data().measureNumber}
      return {start: parseDateTime(event.data().datetime).toDate(), end: moment().toDate(), title: `${event.data().measureType}-${event.data().measureNumber}`, description: event.data().description }
      // return {start: parseDateTime(event.data().datetime).toDate(), end: parseDateTime(event.data().datetime).toDate(), title: event.data().measureNumber}
      // return {start: moment().toDate(), end: moment().toDate(), title: event.data().measureNumber}


  });
  return (
    <div>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default EventCalendar;