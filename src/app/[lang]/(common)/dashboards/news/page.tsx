import { getDictionary } from '@/app/[lang]/dictionaries';
import { AvgDailyTraffic } from '@/components/AvgDailyTraffic';
import { Comments } from '@/components/Comments';
import { DailyFeed } from '@/components/DailyFeed';
import { LatestNotifications } from '@/components/LatestNotifications';
import { MarketingCampaign } from '@/components/MarketingCampaign';
import { NewAuthors } from '@/components/NewAuthors';
import { NewArticles } from '@/components/NewsArticles';
import { NewSubscribers } from '@/components/NewSubscribers';
import { PopularArticles } from '@/components/PopularArticles';
import { PopularAuthors } from '@/components/PopularAuthors';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function News(props: Params) {
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
          <NewSubscribers subheader={widgets.subheader.newSubscribers} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <NewArticles subheader={widgets.subheader.newArticles} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <NewAuthors subheader={widgets.subheader.newAuthors} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <AvgDailyTraffic subheader={widgets.subheader.avgDailyTraffic} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <PopularAuthors
            title={widgets.title.popularAuthors}
            subheader={widgets.subheader.popularAuthors}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <PopularArticles title={widgets.title.popularArticles} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LatestNotifications title={widgets.title.latestNotifications} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DailyFeed title={widgets.title.dailyFeed} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Comments title={widgets.title.comments} scrollHeight={450} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MarketingCampaign
            title={widgets.title.marketingCampaign}
            subheader={widgets.subheader.marketingCampaign}
            scrollHeight={430}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
