import { time } from '@/utilities/constants/data';
import { ASSET_AVATARS } from '@/utilities/constants/paths';

export interface ConnectionDataObject {
  id: number;
  user: {
    id: number;
    name: string;
    username: string;
    profile_pic: string;
  };
  follow: boolean;
  created_at: string;
}

export const connections: ConnectionDataObject[] = [
  {
    id: 32,
    user: {
      id: 21,
      name: 'Julia Robert',
      username: 'julia.robert',
      profile_pic: `${ASSET_AVATARS}/avatar4.jpg`,
    },
    follow: true,
    created_at: time[0],
  },
  {
    id: 33,
    user: {
      id: 22,
      name: 'Joe Lee',
      username: 'joe.lee',
      profile_pic: `${ASSET_AVATARS}/avatar5.jpg`,
    },
    follow: false,
    created_at: time[1],
  },
  {
    id: 34,
    user: {
      id: 23,
      name: 'Chang Lee',
      username: 'chang.lee',
      profile_pic: `${ASSET_AVATARS}/avatar6.jpg`,
    },
    follow: false,
    created_at: time[2],
  },
  {
    id: 35,
    user: {
      id: 24,
      name: 'Mickey Arthur',
      username: 'mickey.arthur',
      profile_pic: `${ASSET_AVATARS}/avatar7.jpg`,
    },
    follow: true,
    created_at: time[2],
  },
  {
    id: 36,
    user: {
      id: 25,
      name: 'Shane Watson',
      username: 'shane.watson',
      profile_pic: `${ASSET_AVATARS}/avatar8.jpg`,
    },
    follow: true,
    created_at: time[3],
  },
];
