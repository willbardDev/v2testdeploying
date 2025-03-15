import { FeedInvitation } from '@/components/FeedInvitation';
import { FeedPhotoUpload } from '@/components/FeedPhotoUpload';
import { FeedSharedPost } from '@/components/FeedSharedPost';
import { Feed } from '@/types/feedData';

const FeedComponents = {
  PROJECT_INVITATION: FeedInvitation,
  PHOTOS_UPLOADED: FeedPhotoUpload,
  SHARED_POST: FeedSharedPost,
};

interface FeedItemProps {
  feed: Feed;
}
const FeedItem = ({ feed }: FeedItemProps) => {
  const FeedComponent = FeedComponents[feed.type];
  return <FeedComponent feed={feed} />;
};

export { FeedItem };
