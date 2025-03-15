'use client';
import { JumboCard } from '@jumbo/components';
import useSwalWrapper from '@jumbo/vendors/sweetalert2/hooks';
import Button from '@mui/material/Button';

const BasicAlert = () => {
  const Swal = useSwalWrapper();
  const sweetAlerts = () => {
    Swal.fire({
      title: 'You clicked the button',
    });
  };
  return (
    <JumboCard
      title={'Basic'}
      contentWrapper
      contentSx={{ pt: 0 }}
    >
      <Button variant={'outlined'} onClick={sweetAlerts}>
        Click me
      </Button>
    </JumboCard>
  );
};

export { BasicAlert };
