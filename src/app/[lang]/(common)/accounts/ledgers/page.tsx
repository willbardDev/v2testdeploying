import ledgerServices from '@/components/accounts/ledgers/ledger-services';
import Ledgers from '@/components/accounts/ledgers/Ledgers';
import { serverSideAxios } from '@/lib/services/config';

export default async function Page({ searchParams }:{ searchParams: any}) {
  const axiosInstance = await serverSideAxios();

  const queryParams = {
    category: searchParams?.category,
    id: searchParams?.id,
    keyword: searchParams?.keyword || '',
    page: 1,
    limit: 10,
  };

  const serverFetchedData = await ledgerServices.getLedgers(queryParams, axiosInstance);

  return (
    <Ledgers initialData={serverFetchedData} />
  );
}
