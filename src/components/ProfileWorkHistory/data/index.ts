import { ASSET_IMAGES } from '@/utilities/constants/paths';

export interface ExperienceProps {
  id: number;
  role: string;
  company: string;
  location: string;
  type: string;
  period: string;
  companyLogo: string;
}
export const experiencesData: ExperienceProps[] = [
  {
    id: 1,
    role: 'Sr. Business System Analyst',
    company: 'Charter Communications - Full-time',
    location: 'California, United States',
    type: '',
    period: 'Oct 2023 - Present',
    companyLogo: `${ASSET_IMAGES}/profiles/work-1.png`, // Replace with actual logo link
  },
  {
    id: 2,
    role: 'Associate PM/Scrum Master',
    company: 'Auxano Technology Consultants',
    location: 'NJ, United States - Remote',
    type: '',
    period: 'Apr 2022 - Sep 2023',
    companyLogo: `${ASSET_IMAGES}/profiles/work-2.png`, // Replace with actual logo link
  },
];
