import { getDictionary } from '@/app/[lang]/dictionaries';
import { CurrencyCalculator } from '@/components/CurrencyCalculator';
import { CurrentProjectsList } from '@/components/CurrentProjectsList';
import { FilesCounterCard } from '@/components/FilesCounterCard';
import { Growth } from '@/components/Growth';
import { NewCustomers } from '@/components/NewCustomers';
import { ProjectCounterCard } from '@/components/ProjectCounterCard';
import { RecentActivities1 } from '@/components/RecentActivities1';
import { RecentTickets } from '@/components/RecentTickets';
import { RevenueHistory } from '@/components/RevenueHistory';
import { RevenueOverview } from '@/components/RevenueOverview';
import { TasksCounterCard } from '@/components/TaskCounterCard';
import { TasksList2 } from '@/components/TasksList2';
import { TeamsCounterCard } from '@/components/TeamsCounterCard';
import { TicketsStatus } from '@/components/TicketsStatus';
import { WelcomeSummary } from '@/components/WelcomSummary';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function Crm(props: Params) {
  const params = await props.params;
  const { lang } = params;
  const { widgets } = await getDictionary(lang);
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
      <Grid container spacing={3.5}>
        <Grid size={{ xs: 12 }}>
          <WelcomeSummary title={widgets.title.welcomeEMA} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <RevenueHistory title={widgets.title.revenueHistory} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <NewCustomers title={widgets.title.newCustomer} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Growth title={widgets.title.growth} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <ProjectCounterCard subheader={widgets.subheader.projects} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TasksCounterCard subheader={widgets.subheader.tasks} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TeamsCounterCard subheader={widgets.subheader.teams} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FilesCounterCard subheader={widgets.subheader.files} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TasksList2 scrollHeight={373} title={widgets.title.taskList} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrentProjectsList
            title={widgets.title.currentProjects}
            subheader={widgets.subheader.currentProjects}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <RecentTickets title={widgets.title.recentTicket} />
        </Grid>
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <TicketsStatus title={widgets.title.ticketStatus} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RevenueOverview title={widgets.title.revenueOverview} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentActivities1
            title={widgets.title.recentActivities}
            scrollHeight={306}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrencyCalculator title={widgets.title.currencyCal} />
        </Grid>
      </Grid>
    </Container>
  );
}
