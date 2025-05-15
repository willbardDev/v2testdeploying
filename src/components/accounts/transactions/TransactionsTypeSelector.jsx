import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useDebouncedCallback } from 'beautiful-react-hooks';
import React from 'react';

const transactionTypes = [
  {
    label: 'Payments',
    value: 'payments',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
      PERMISSIONS.PAYMENTS_READ,
      PERMISSIONS.PAYMENTS_CREATE,
      PERMISSIONS.PAYMENTS_EDIT,
      PERMISSIONS.PAYMENTS_DELETE,
    ]
  },
  {
    label: 'Receipts',
    value: 'receipts',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
      PERMISSIONS.RECEIPTS_READ,
      PERMISSIONS.RECEIPTS_EDIT,
      PERMISSIONS.RECEIPTS_CREATE,
      PERMISSIONS.RECEIPTS_DELETE,
    ]
  },
  {
    label: 'Journal Vouchers',
    value: 'journal_vouchers',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
      PERMISSIONS.JOURNAL_VOUCHERS_READ,
      PERMISSIONS.JOURNAL_VOUCHERS_CREATE,
      PERMISSIONS.JOURNAL_VOUCHERS_DELETE,
      PERMISSIONS.JOURNAL_VOUCHERS_EDIT
    ]
  },
  {
    label: 'Transfers',
    value: 'transfers',
    permissions: [
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_READ,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_CREATE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_DELETE,
      PERMISSIONS.ACCOUNTS_TRANSACTIONS_EDIT,
      PERMISSIONS.FUND_TRANSFERS_READ,
      PERMISSIONS.FUND_TRANSFERS_CREATE,
      PERMISSIONS.FUND_TRANSFERS_DELETE,
      PERMISSIONS.FUND_TRANSFERS_EDIT
    ]
  }
];

function TransactionsTypeSelector({ onChange, value }) {
  const [type, setType] = React.useState(value);
  const { checkOrganizationPermission } = useJumboAuth();

  const handleChange = useDebouncedCallback((event) => {
    setType(event.target.value);
  });

  React.useEffect(() => {
    onChange(type);
  }, [type]);

  React.useEffect(() => {
    return () => handleChange.cancel();
  }, []);

  const filteredTypes = transactionTypes.filter(({ permissions }) =>
     permissions.length === 0 || checkOrganizationPermission(permissions)
  );

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small" label="Type">
        <Select
          labelId="transaction-types-filter-label"
          id="transaction-types-filter-select"
          value={value}
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
}

export default TransactionsTypeSelector;
