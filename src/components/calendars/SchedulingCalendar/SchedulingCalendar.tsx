'use client';
import { currentYear } from '@/utilities/constants/data';
import moment from 'moment';
import 'moment/locale/ar';
import 'moment/locale/en-gb';
import 'moment/locale/en-in';
import 'moment/locale/es';
import 'moment/locale/fr';
import React from 'react';
import { Calendar, View, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { schedulingData } from '../data';

const resourceMap = [
  { resourceId: 1, resourceTitle: 'Board room' },
  { resourceId: 2, resourceTitle: 'Training room' },
  { resourceId: 3, resourceTitle: 'Meeting room 1' },
  { resourceId: 4, resourceTitle: 'Meeting room 2' },
];
const localizer = momentLocalizer(moment);
const SchedulingCalendar = () => {
  const [date, setDate] = React.useState(new Date(currentYear, 0, 29));
  const [viewOption, setViewOption] = React.useState<View>('day');

  return (
    <Calendar
      date={date}
      defaultView={Views.DAY}
      events={schedulingData}
      localizer={localizer}
      resourceIdAccessor='resourceId'
      resources={resourceMap}
      resourceTitleAccessor='resourceTitle'
      step={60}
      view={viewOption}
      culture={'en'}
      views={['day', 'work_week']}
      onView={(option) => setViewOption(option)}
      onNavigate={(newDate: Date) => setDate(newDate)}
    />
  );
};
export { SchedulingCalendar };
