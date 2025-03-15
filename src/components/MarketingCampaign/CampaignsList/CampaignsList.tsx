import { List } from '@mui/material';
import { CampaignItem } from '../CampaignItem';
import { marketingCampaigns } from '../data';

const CampaignsList = () => {
  return (
    <List disablePadding>
      {marketingCampaigns.map((item, index) => (
        <CampaignItem item={item} key={index} />
      ))}
    </List>
  );
};

export { CampaignsList };
