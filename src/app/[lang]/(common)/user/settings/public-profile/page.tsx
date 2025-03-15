import { PublicProfile } from '@/components/settings/PublicProfile';
import { SettingHeader } from '@/components/settings/SettingHeader';

export default function PublicProfilePage() {
  return (
    <>
      <SettingHeader title={'Public Profile'} />
      <PublicProfile />
    </>
  );
}
