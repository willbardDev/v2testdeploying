import { getDictionary } from '@/app/[lang]/dictionaries';
import { BitcoinPrice } from '@/components/BitcoinPrice';
import { CryptoNews } from '@/components/CryptoNews';
import { CurrencyCalculator } from '@/components/CurrencyCalculator';
import { EarnRewardCard } from '@/components/EarnRewardCard';
import { EarningExpenses } from '@/components/EarningExpenses';
import { EthereumPrice } from '@/components/EthereumPrice';
import { LatestPosts } from '@/components/LatestPosts';
import { LitcoinPrice } from '@/components/LitcoinPrice';
import { MarketingCampaign } from '@/components/MarketingCampaign';
import { PortfolioBalance } from '@/components/PortfolioBalance';
import { RipplePrice } from '@/components/RipplePrice';
import { WordOfTheDay1 } from '@/components/WordOfTheDay1';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';

import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function Crypto(props: Params) {
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
          <BitcoinPrice subheader={widgets.subheader.bitcoinPrice} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <RipplePrice subheader={widgets.subheader.ripplePrice} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <EthereumPrice subheader={widgets.subheader.ethereumPrice} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <LitcoinPrice subheader={widgets.subheader.litecoinPrice} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PortfolioBalance title={widgets.title.cryptoPortfolio} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <EarningExpenses />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WordOfTheDay1 />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EarnRewardCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <CurrencyCalculator title={widgets.title.currencyCal} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <LatestPosts
            title={widgets.title.latestPosts}
            subheader={widgets.subheader.latestPosts}
            scrollHeight={356}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MarketingCampaign
            title={widgets.title.marketingCampaign}
            subheader={widgets.subheader.marketingCampaign}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CryptoNews title={widgets.title.cryptoNews} />
        </Grid>
      </Grid>
    </Container>
  );
}
