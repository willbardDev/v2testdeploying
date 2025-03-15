import { getDictionary } from '@/app/[lang]/dictionaries';
import { AyurvedaCard } from '@/components/AyurvedaCard';
import { CityBgCard } from '@/components/CityBgCard';
import { CryptoNews } from '@/components/CryptoNews';
import { CurrencyCalculator } from '@/components/CurrencyCalculator';
import { CurrentProjectsList } from '@/components/CurrentProjectsList';
import { DailyFeed } from '@/components/DailyFeed';
import { EarningExpenses } from '@/components/EarningExpenses';
import { EventInviteConfirmCard } from '@/components/EventInviteConfirmCard';
import { ExplorePlaceCard } from '@/components/ExplorePlaceCard';
import { FeaturedCard1 } from '@/components/FeaturedCard1';
import { FlyingBird } from '@/components/FlyingBird';
import { GoogleNest } from '@/components/GoogleNest/GoogleNest';
import { LatestPosts } from '@/components/LatestPosts';
import { MarketingCampaign } from '@/components/MarketingCampaign';
import { NewConnections } from '@/components/NewConnections';
import { NewsPhotos } from '@/components/NewPhotos';
import { NewRequests } from '@/components/NewRequests';
import { NewsLetterSubscription } from '@/components/NewsLetterSubscription';
import { OurOffice } from '@/components/OurOffice';
import { PortfolioBalance } from '@/components/PortfolioBalance';
import { ProductImage } from '@/components/ProductImage';
import { ProjectCard } from '@/components/ProjectCard';
import { RecentActivities } from '@/components/RecentActivities';
import { SiteVisitors } from '@/components/SiteVisitors';
import { Summary } from '@/components/Summary';
import { TaskListExpandable } from '@/components/TaskListExpandable';
import { UpgradePlan } from '@/components/UpgradePlan';
import { UserProfileAction } from '@/components/UserProfileAction';
import { UserProfileCard1 } from '@/components/UserProfileCard1';
import { WeeklySales } from '@/components/WeeklySales';
import { WordOfTheDay } from '@/components/WordOfTheDay';
import { WordOfTheDay1 } from '@/components/WordOfTheDay1';
import { YourCurrentPlan } from '@/components/YourCurrentPlan';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { EmojiObjectsOutlined, FolderOpen } from '@mui/icons-material';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function Widgets(props: Params) {
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
        <Grid size={{ xs: 12, lg: 6 }}>
          <PortfolioBalance title={widgets.title.cryptoPortfolio} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <EarningExpenses />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AyurvedaCard height={175} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewConnections
            title={widgets.title.newConnections}
            scrollHeight={296}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ProjectCard title={widgets.title.projectSummary} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewsLetterSubscription
            title={widgets.title.newsLetter}
            subheader={widgets.subheader.newsLetter}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewsPhotos />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <FlyingBird
            title={widgets.title.flyingBird}
            subheader={widgets.subheader.flyingBird}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OurOffice title={widgets.title.ourOffice} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CurrencyCalculator title={widgets.title.currencyCal} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WordOfTheDay1 />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Summary />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ProductImage height={320} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ExplorePlaceCard height={400} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EventInviteConfirmCard
            title={widgets.title.eventInvite}
            subheader={widgets.title.eventInvite}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <UserProfileCard1 />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <GoogleNest />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <YourCurrentPlan title={widgets.title.yourCurrentPlan} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Grid container spacing={3.75}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeaturedCard1
                title={'23'}
                subheader='Ideas'
                icon={<EmojiObjectsOutlined sx={{ fontSize: 42 }} />}
                bgcolor={['135deg', '#FBC79A', '#D73E68']}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeaturedCard1
                title={'250'}
                subheader='Docs'
                icon={<FolderOpen sx={{ fontSize: 36 }} />}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CityBgCard />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <WeeklySales
            title={widgets.title.weeklySales}
            subheader={widgets.subheader.weeklySales}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LatestPosts
            title={widgets.title.latestPosts}
            subheader={widgets.subheader.latestPosts}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MarketingCampaign
            title={widgets.title.marketingCampaign}
            subheader={widgets.subheader.marketingCampaign}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrentProjectsList
            title={widgets.title.currentProjects}
            subheader={widgets.subheader.currentProjects}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <NewRequests
            title={widgets.title.newRequests}
            subheader={widgets.subheader.newRequests}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentActivities
            title={widgets.title.recentActivities}
            scrollHeight={304}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TaskListExpandable
            title={widgets.title.taskList}
            subheader={widgets.subheader.taskList}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DailyFeed title={widgets.title.dailyFeed} scrollHeight={398} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <UpgradePlan />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WordOfTheDay title={widgets.title.wordOfTheDay} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <UserProfileAction />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SiteVisitors
            title={widgets.title.siteVisitors}
            subheader={widgets.subheader.siteVisitors}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CryptoNews title={widgets.title.cryptoNews} />
        </Grid>
      </Grid>
    </Container>
  );
}
