import { ContentPlaceholder } from '@/components/ChatApp/ChatAppContent/ContentPlaceholder';

const ChatAppPage = async (props: { params: Promise<{ id: number }> }) => {
  const params = await props.params;
  if (!params.id) return <ContentPlaceholder />;
};

export default ChatAppPage;
