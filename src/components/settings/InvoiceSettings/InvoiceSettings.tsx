import { AppPagination1 } from '@/components/AppPagination1';
import { invoicesData } from '@/components/Invoice1/data';
import { InvoiceFilter } from '@/components/Invoice1/InvoiceFilter';
import { InvoicesList } from '@/components/Invoice1/InvoicesList';
import { SearchPopover } from '@/components/SearchPopover';
import { JumboCard } from '@jumbo/components';
import { Span } from '@jumbo/shared';
import { Box, Stack, Typography } from '@mui/material';
import { SettingHeader } from '../SettingHeader';

const InvoiceSettings = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <SettingHeader title={'Invoices'} divider sx={{ mb: 3 }} />
      <JumboCard
        title={<SearchPopover placeholder={'Enter invoice number'} />}
        action={<InvoiceFilter />}
        contentWrapper
        sx={{ mb: 3 }}
        contentSx={{ pt: 0 }}
      >
        <InvoicesList />
      </JumboCard>
      <Stack direction={'row'} justifyContent={'space-between'} sx={{ mx: 2 }}>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          Showing <Span sx={{ color: 'text.primary' }}>1</Span> of{' '}
          <Span sx={{ color: 'text.primary' }}>{invoicesData?.length}</Span>
        </Typography>
        <AppPagination1 data={invoicesData} />
      </Stack>
    </Box>
  );
};
export { InvoiceSettings };
