'use client';
import { Div } from '@jumbo/shared';
import { Card, CardContent, Typography } from '@mui/material';
import { ChartAppUsers } from './ChartAppUsers';
interface AppUsersProps {
  title: React.ReactNode;
  subheader: React.ReactNode;
}
const AppUsers = ({ title, subheader }: AppUsersProps) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Div sx={{ pb: 1.25 }}>
          <Typography variant='h5'>{title}</Typography>
          <Typography variant='h6' color={'text.secondary'}>
            {subheader}
          </Typography>
        </Div>
        <ChartAppUsers />
      </CardContent>
    </Card>
  );
};

export { AppUsers };
