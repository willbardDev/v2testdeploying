'use client';

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import currencyServices from '../currency-services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ExchangeRate {
  id: number;
  rate_datetime: string;
  rate: number;
  updated_by: {
    name: string;
  };
}

interface ExchangeRatesItemActionProps {
  openExchangeRateDeleteDialog: boolean;
  setOpenExchangeRateDeleteDialog: (open: boolean) => void;
  selectedExchangeRate: ExchangeRate | null;
  setSelectedExchangeRate: React.Dispatch<React.SetStateAction<ExchangeRate | null>>;
}

const ExchangeRatesItemAction: React.FC<ExchangeRatesItemActionProps> = ({
  openExchangeRateDeleteDialog,
  setOpenExchangeRateDeleteDialog,
  selectedExchangeRate,
  setSelectedExchangeRate
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: deleteExchangeRate } = useMutation({
    mutationFn: currencyServices.deleteExchangeRate,
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
      enqueueSnackbar(data.message, {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
    },
  });

  return (
    <Dialog open={openExchangeRateDeleteDialog} onClose={() => setOpenExchangeRateDeleteDialog(false)}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this Exchange Rate?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setSelectedExchangeRate(null);
            setOpenExchangeRateDeleteDialog(false);
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (selectedExchangeRate) {
              deleteExchangeRate(selectedExchangeRate.id);
              setSelectedExchangeRate(null);
              setOpenExchangeRateDeleteDialog(false);
            }
          }}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExchangeRatesItemAction;
