import { getDictionary } from '@/app/[lang]/dictionaries';
import { AppUsers } from '@/components/AppUsers';
import { CafeStore1 } from '@/components/CafeStore1';
import { DailyFeed } from '@/components/DailyFeed';
import { ExplorePlaceCard } from '@/components/ExplorePlaceCard';
import { FeaturedCard1 } from '@/components/FeaturedCard1';
import { LastMonthSales } from '@/components/LastMonthSales';
import { LatestNotifications } from '@/components/LatestNotifications';
import { MapProvider } from '@/components/maps/MapProvider';
import { MarkerClustererMap } from '@/components/maps/MarkerClustererMap';
import { NewConnections } from '@/components/NewConnections';
import { NewVisitorsThisMonth } from '@/components/NewVisitorsThisMonth';
import { OnlineSignupsFilled } from '@/components/OnlineSignupsFilled';
import { Orders } from '@/components/Orders1';
import { OurOffice1 } from '@/components/OurOffice1';
import { PopularProducts } from '@/components/PopularProducts';
import { ProductImage } from '@/components/ProductImage';
import { ProjectsListCard } from '@/components/ProjectsListCard';
import { RecentActivities } from '@/components/RecentActivities';
import { SalesOverview } from '@/components/SalesOverview';
import { SalesReport1 } from '@/components/SalesReport1';
import { ScheduleCard } from '@/components/ScheduleCard';
import { TotalRevenueThisYear } from '@/components/TotalRevenueThisYear';
import { UpgradePlan } from '@/components/UpgradePlan';
import { UserProfileAction } from '@/components/UserProfileAction';
import { UserProfileCard } from '@/components/UserProfileCard';
import { UserSummary } from '@/components/UserSummary';
import { WordOfTheDay } from '@/components/WordOfTheDay';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { EmojiObjectsOutlined, FolderOpen } from '@mui/icons-material';

import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function Misc(props: Params) {
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
        <Grid size={{ xs: 12, lg: 7 }}>
          <SalesOverview title={widgets.title.salesOverview} />
        </Grid>
        <Grid size={{ xs: 12, lg: 2 }}>
          <Grid container spacing={3.75}>
            <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
              <FeaturedCard1
                title={'250'}
                subheader='Docs'
                icon={<FolderOpen sx={{ fontSize: 36 }} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
              <FeaturedCard1
                title={'23'}
                subheader='Ideas'
                icon={<EmojiObjectsOutlined sx={{ fontSize: 42 }} />}
                bgcolor={['135deg', '#FBC79A', '#D73E68']}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Grid container spacing={3.75}>
            <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
              <Orders title={widgets.title.orders} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
              <UserSummary
                title={widgets.title.userSummary}
                subheader={widgets.subheader.userSummary}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <PopularProducts
            title={widgets.title.popularProducts}
            subheader={widgets.subheader.popularProducts}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ProjectsListCard title={widgets.title.projectsList} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ProductImage height={370} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CafeStore1 />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ExplorePlaceCard height={450} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <LatestNotifications title={widgets.title.latestAlerts} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <DailyFeed title={widgets.title.dailyFeed} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <ScheduleCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <UserProfileCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewConnections title={widgets.title.newConnections} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <RecentActivities title={widgets.title.recentActivities} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <LastMonthSales subheader={widgets.subheader.latestMonthSales} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <OnlineSignupsFilled subheader={widgets.subheader.onlineSignups} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <NewVisitorsThisMonth subheader={widgets.subheader.newVisitors} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TotalRevenueThisYear
            subheader={widgets.subheader.totalRevenueYear}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <UpgradePlan />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <SalesReport1 title={widgets.title.salesReport1} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <AppUsers
            title={widgets.title.appUsers}
            subheader={widgets.subheader.appUsers}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <WordOfTheDay title={widgets.title.wordOfTheDay} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OurOffice1 title={widgets.title.ourOffice1} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <UserProfileAction height={282} />
        </Grid>
        {/* TODO: taking a lot of time  */}
        <Grid size={{ xs: 12 }}>
          <MapProvider>
            <MarkerClustererMap />
          </MapProvider>
        </Grid>
      </Grid>
    </Container>
  );
}
