import { Spinner } from '@/components/Spinner';
import { Card } from '@mui/material';

export default function Loading() {
  return (
    <Card
      sx={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 4,
        alignItems: 'center',
      }}
    >
      <Spinner />
    </Card>
  );
}
