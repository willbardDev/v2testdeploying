import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';

type TransactionType = 'payments' | 'receipts' | 'journal_vouchers' | 'transfers' | string;

interface TransactionTypeOption {
  label: string;
  value: TransactionType;
  permissions: string[];
}

interface TransactionsTypeSelectorProps {
  onChange: (type: TransactionType) => void;
  value: TransactionType;
}

const transactionTypes: TransactionTypeOption[] = [
  {
    label: 'Payments',
    value: 'payments',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.PAYMENTS_READ,
    ]
  },
  {
    label: 'Receipts',
    value: 'receipts',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.RECEIPTS_READ,
    ]
  },
  {
    label: 'Journal Vouchers',
    value: 'journal_vouchers',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.JOURNAL_VOUCHERS_READ,
    ]
  },
  {
    label: 'Transfers',
    value: 'transfers',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.FUND_TRANSFERS_READ,
    ]
  }
];

const TransactionsTypeSelector: React.FC<TransactionsTypeSelectorProps> = ({ onChange, value }) => {
  const { checkOrganizationPermission } = useJumboAuth();
  const [type, setType] = React.useState<TransactionType>(value);

  const handleChange = (event: SelectChangeEvent<TransactionType>) => {
    const newValue = event.target.value as TransactionType;
    setType(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    onChange(type);
  }, [type, onChange]);

  const filteredTypes = transactionTypes.filter(({ permissions }) =>
    permissions.length === 0 || checkOrganizationPermission(permissions)
  );

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl component="div" fullWidth size="small">
        <InputLabel id="transaction-types-filter-label">Type</InputLabel>
        <Select
          labelId="transaction-types-filter-label"
          id="transaction-types-filter-select"
          value={value}
          label="Type"
          fullWidth
          onChange={handleChange}
        >
          {filteredTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TransactionsTypeSelector;