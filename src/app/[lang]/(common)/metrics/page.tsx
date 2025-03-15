import { getDictionary } from '@/app/[lang]/dictionaries';
import { ActiveUsers } from '@/components/ActiveUsers';
import { AvgDailyTraffic } from '@/components/AvgDailyTraffic';
import { CreditScore } from '@/components/CreditScore';
import { EmailCampaign } from '@/components/EmailCampaign';

import { LastMonthSales } from '@/components/LastMonthSales';
import { NewAuthors } from '@/components/NewAuthors';
import { NewSubscribers } from '@/components/NewSubscribers';
import { NewVisitorsThisMonth } from '@/components/NewVisitorsThisMonth';
import { NewArticles } from '@/components/NewsArticles';
import { OnlineSignups } from '@/components/OnlineSignups';
import { OnlineSignupsFilled } from '@/components/OnlineSignupsFilled';
import { Orders } from '@/components/Orders';
import { OrdersCard } from '@/components/OrdersCard';
import { OrdersReport } from '@/components/OrdersReport';
import { PageViews } from '@/components/PageViews';
import { QueriesCard } from '@/components/QueriesCard';
import { RevenueThisYear } from '@/components/RevenueThisYear';
import { RevenuesCard } from '@/components/RevenuesCard';
import { SalesReport } from '@/components/SalesReport';
import { Stocks } from '@/components/Stocks';
import { TotalRevenueThisYear } from '@/components/TotalRevenueThisYear';
import { TrafficAnalysis } from '@/components/TrafficAnalysis';
import { VisitsCard } from '@/components/VisitsCard';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function Metrics(props: Params) {
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
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <LastMonthSales subheader={widgets.subheader.latestMonthSales} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <OnlineSignupsFilled subheader={widgets.subheader.onlineSignups} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <NewVisitorsThisMonth subheader={widgets.subheader.newVisitors} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TotalRevenueThisYear
            subheader={widgets.subheader.totalRevenueYear}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OrdersReport
            title={widgets.title.orderReports}
            subheader={widgets.subheader.orderReports}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CreditScore
            title={widgets.title.creditScore}
            subheader={widgets.subheader.creditScore}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TrafficAnalysis
            title={widgets.title.trafficAnalysis}
            subheader={widgets.subheader.trafficAnalysis}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <OrdersCard
            vertical={true}
            subTitle={widgets.subheader.objectCountOrders}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <RevenuesCard subTitle={widgets.subheader.objectCountRevenues} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <VisitsCard subTitle={widgets.subheader.objectCountVisits} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <QueriesCard subTitle={widgets.subheader.objectCountQueries} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OnlineSignups subheader={widgets.subheader.onlineSignups1} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <RevenueThisYear subheader={widgets.subheader.revenueThisYear} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EmailCampaign subheader={widgets.subheader.emailCampaign} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AvgDailyTraffic subheader={widgets.subheader.avgDailyTraffic} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewSubscribers subheader={widgets.subheader.newSubscribers} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewAuthors subheader={widgets.subheader.newAuthors} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewArticles subheader={widgets.subheader.newArticles} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <SalesReport title={widgets.title.salesReports} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ActiveUsers subheader={widgets.subheader.activeUsers} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <PageViews title={widgets.title.pageViews} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Orders title={widgets.title.orders1} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Stocks title={widgets.title.stock} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <OrdersCard
            vertical={true}
            subTitle={widgets.subheader.objectCountOrders}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <RevenuesCard subTitle={widgets.subheader.objectCountRevenues} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <VisitsCard subTitle={widgets.subheader.objectCountVisits} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <QueriesCard subTitle={widgets.subheader.objectCountQueries} />
        </Grid>
      </Grid>
    </Container>
  );
}
