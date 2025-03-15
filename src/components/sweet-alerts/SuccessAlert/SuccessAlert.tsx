'use client';
import { JumboCard } from '@jumbo/components';
import useSwalWrapper from '@jumbo/vendors/sweetalert2/hooks';
import Button from '@mui/material/Button';

const SuccessAlert = () => {
  const Swal = useSwalWrapper();
  const sweetAlerts = () => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
    });
  };
  return (
    <JumboCard title={'Success alert'} contentWrapper contentSx={{ pt: 0 }}>
      <Button variant={'outlined'} onClick={sweetAlerts}>
        Click me
      </Button>
    </JumboCard>
  );
};

export { SuccessAlert };
