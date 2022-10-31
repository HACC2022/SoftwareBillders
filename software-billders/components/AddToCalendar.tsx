import {Button} from "semantic-ui-react";
import { atcb_action } from 'add-to-calendar-button';
import 'add-to-calendar-button/assets/css/atcb.css';
import moment from 'moment'

const AddToCalendar = ( {document} ) => {

  // TODO: Not have a repeat in here AND eventCalendar. Create
  const parseDateTime = function(dateTime:string) {
    if (dateTime !== undefined) {
      dateTime = dateTime.substring(0, dateTime.lastIndexOf(',')) + dateTime.substring(dateTime.lastIndexOf(',') + 1);
      return moment(dateTime, "LLLL")
    }
    return moment()
  }
  const measureHearing: string = `${document.data().measureType}-${document.data().measureNumber}`;
  const dateTimeFormat = parseDateTime(document.data().datetime);
  return (
    <Button
      onClick={() => {
        atcb_action({
          name: measureHearing,
          startDate: dateTimeFormat.format("YYYY-MM-DD"),
          endDate: dateTimeFormat.format("YYYY-MM-DD"),
          startTime: dateTimeFormat.format("kk:mm"),
          endTime: dateTimeFormat.add(1, "h").format("kk:mm"),
          location: 'Pearl City',
          options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'Yahoo'],
          timeZone: 'Pacific/Honolulu',
          iCalFileName: 'Reminder-Event',
        });
      }}
    >
      Add to Calendar
    </Button>
  );
}

export default AddToCalendar;
