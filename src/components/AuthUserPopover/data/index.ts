import { ASSET_AVATARS } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';

export type AuthUserProps = {
  email: string;
  name: string;
  profile_pic: string;
  handle: string;
  job_title: string;
};
export const authUser: AuthUserProps = {
  email: 'kiley.brown@example.com',
  name: 'Kiley Brown',
  profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`, `60x60`),
  handle: 'kiley.brown@example.com',
  job_title: 'Creative Head',
};
