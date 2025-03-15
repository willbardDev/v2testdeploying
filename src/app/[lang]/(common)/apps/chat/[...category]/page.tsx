import ChatAppContent from '@/components/ChatApp/ChatAppContent/ChatAppContent';
import { use } from 'react';
type Params = { category: string };
const ChatAppCategories = (props: { params: Promise<Params> }) => {
  const params = use(props.params);
  const { category } = params;
  return <ChatAppContent category={category} />;
};

export default ChatAppCategories;
