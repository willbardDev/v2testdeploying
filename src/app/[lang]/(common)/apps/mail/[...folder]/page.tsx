import { MailDetail } from '@/components/MailApp/MailDetail';
import { MailsList } from '@/components/MailApp/MailsList';

const MailAppPage = async (props: { params: Promise<any> }) => {
  const params = await props.params;

  const { folder } = params;

  if (folder[0] === 'messages') return <MailDetail />;
  return <MailsList />;
};

export default MailAppPage;
