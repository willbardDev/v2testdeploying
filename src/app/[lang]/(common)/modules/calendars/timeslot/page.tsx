import { getDictionary } from '@/app/[lang]/dictionaries';
import { CalendarWrapper } from '@/components/calendars/CalendarWrapper';
import { TimeslotCalendar } from '@/components/calendars/TimeslotCalendar';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { JumboCard } from '@jumbo/components';
import { Container, Typography } from '@mui/material';
export default async function TimeslotCalendarPage(props: Params) {
  const params = await props.params;
  const { lang } = params;

  const { modules } = await getDictionary(lang);
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
      }}
      disableGutters
    >
      <Typography variant={'h1'} mb={3}>
        {modules.title.timeslotCalendar}
      </Typography>
      <JumboCard contentWrapper>
        <CalendarWrapper>
          <TimeslotCalendar />
        </CalendarWrapper>
      </JumboCard>
    </Container>
  );
}
