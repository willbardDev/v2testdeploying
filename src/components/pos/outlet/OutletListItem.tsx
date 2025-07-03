import React from 'react';
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Grid,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { Outlet, OutletType, outletTypeLabels } from './OutletType';

type OutletListItemProps = {
  outlet: Outlet;
};

const OutletListItem: React.FC<OutletListItemProps> = ({ outlet }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          {/* Header: Name & Type */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h6">{outlet.name}</Typography>
          </Grid>
          <Grid  size={{ xs: 12, md: 4 }}
            container
            direction="row"
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Chip
              label={outletTypeLabels[outlet.type as OutletType] || outlet.type}
              size="small"
              color="primary"
            />
            <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h6">{outlet.name}</Typography>
            </Grid>

            <Grid  size={{ xs: 12, md: 4 }}
            container
            direction="row"
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Chip
                label={outletTypeLabels[outlet.type as OutletType] || outlet.type}
                size="small"
                color="primary"
                sx={{ mr: 1 }}
            />
            <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleEdit(outlet)}>
                <Edit fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDelete(outlet)}>
                <Delete fontSize="small" />
                </IconButton>
            </Tooltip>
        </Grid>

          </Grid>

          {/* Address */}
          <Grid size={12}>
            <Typography variant="body2" color="text.secondary">
              {outlet.address}
            </Typography>
          </Grid>

          {/* Stores */}
          <Grid size={12}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Stores:
            </Typography>
            <Grid container spacing={1}>
              {outlet.stores?.map((store) => (
                <Grid  key={store.id}>
                  <Chip label={store.name} size="small" />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Counters */}
          <Grid size={12}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Counters:
            </Typography>
            <Box>
              {outlet.counters?.map((counter, idx) => (
                <Typography variant="body2" key={idx}>
                  • {counter.name} — {counter.ledger_ids.length} ledger{counter.ledger_ids.length > 1 ? 's' : ''}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Assigned Users */}
          <Grid size={12}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Assigned Users:
            </Typography>
            <Grid container spacing={1}>
              {outlet.user_ids.map((userId) => (
                <Grid key={userId}>
                  <Chip label={`User ${userId}`} size="small" variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OutletListItem;
