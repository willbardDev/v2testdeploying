export type ProfileStatType = {
  count: number | string;
  label: string;
};

export type ProfileStatsProps = {
  data: ProfileStatType[];
  divider?: boolean;
};
export const data: ProfileStatType[] = [
  { count: 457, label: 'Followers' },
  { count: 689, label: 'Friends' },
  { count: 283, label: 'Following' },
];
