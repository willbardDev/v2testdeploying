import { getDictionary } from '@/app/[lang]/dictionaries';
import { BasicCalendar } from '@/components/calendars/BasicCalendar';
import { CalendarWrapper } from '@/components/calendars/CalendarWrapper';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { JumboCard } from '@jumbo/components';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
export default async function BasicCalendarPage(props: Params) {
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
        {modules.title.basicCalendar}
      </Typography>
      <JumboCard contentWrapper>
        <CalendarWrapper>
          <BasicCalendar />
        </CalendarWrapper>
      </JumboCard>
    </Container>
  );
}
