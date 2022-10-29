import {Button} from "semantic-ui-react";
import { atcb_action } from 'add-to-calendar-button';
import 'add-to-calendar-button/assets/css/atcb.css';

const AddToCalendar = ( {document} ) => {

  const measureHearing: string = `${document.data().measureType}-${document.data().measureNumber}`;

  return (
    <Button
      onClick={() => {
        atcb_action({
          name: measureHearing,
          startDate: '2022-10-14',
          endDate: '2022-10-18',
          startTime: '10:13',
          endTime: '17:57',
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
