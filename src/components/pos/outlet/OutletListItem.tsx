import React from 'react';
import { Divider, Grid, Typography, Tooltip, Chip, Stack } from '@mui/material';
import OutletListItemAction from './OutletListItemAction';
import { Outlet } from './OutletType';
import Outlets from './Outlet';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import IconButton from '@mui/material/IconButton';


interface OutletItemProps {
  outlet: Outlet;
}

const OutletListItem: React.FC<OutletItemProps> = ({ outlet }) => {
  return (
    <>
      <Divider />
      <Grid
        container
        spacing={1}
        alignItems="center"
        px={2}
        py={1}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {/* Outlet Name + Type */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="subtitle1" noWrap>
            {outlet.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {outlet.type}
          </Typography>
        </Grid>

        {/* Address */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" noWrap>
            {outlet.address}
          </Typography>
        </Grid>

        {/* Stores as chips */}
        <Grid size={{ xs: 12, md: 3}}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {outlet.stores?.map((store) => (
              <Chip
                key={store.id}
                label={store.name}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </Grid>

                {/* Counters & Users icon counts */}
          <Grid size={{ xs: 12, md: 2 }} container justifyContent="flex-end" spacing={1}>
            <Grid>
              <Tooltip title={`Counters: ${outlet.counters?.length ?? 0}`}>
                <IconButton size="small" disabled>
                  <PointOfSaleOutlinedIcon fontSize="small" />
                  <Typography variant="body2" fontWeight="bold" ml={0.5}>
                    {outlet.counters?.length ?? 0}
                  </Typography>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid>
              <Tooltip title={`Users: ${outlet.users?.length ?? 0}`}>
                <IconButton size="small" disabled>
                  <PeopleOutlinedIcon fontSize="small" />
                  <Typography variant="body2" fontWeight="bold" ml={0.5}>
                    {outlet.users?.length ?? 0}
                  </Typography>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>


        {/* Action buttons */}
        <Grid size={{ xs: 12, md: 1}} textAlign="end">
          <OutletListItemAction outlet={outlet} />
        </Grid>
      </Grid>
    </>
  );
};

export default OutletListItem;
