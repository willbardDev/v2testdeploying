'use client';
import { JumboCard, JumboScrollbar } from '@jumbo/components';
import { projects } from './data';
import { ProjectList } from './ProjectsList';
interface ProjectListCardProps {
  title: React.ReactNode;
  scrollHeight?: number;
}
const ProjectsListCard = ({ title, scrollHeight }: ProjectListCardProps) => {
  return (
    <JumboCard title={title} contentSx={{ p: 0 }} contentWrapper>
      <JumboScrollbar autoHeight autoHeightMin={392}>
        <ProjectList data={projects} />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { ProjectsListCard };
