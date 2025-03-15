'use client';
//TODO: remove dependency of passing Icon Component in data
import { Timeline } from '@mui/lab';
import { ActivitiesItem } from '../ActivitiesItem';
import { recentActivities } from '../data';

function ActivitiesList() {
  return (
    <Timeline sx={{ m: 0, p: (theme) => theme.spacing(0, 3) }}>
      {recentActivities.map((item, index) => (
        <ActivitiesItem item={item} key={index} />
      ))}
    </Timeline>
  );
}

export { ActivitiesList };
