import React, { createContext, useContext, useState } from 'react';
import { LinearProgress } from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import projectsServices from '../project-services';

const ProjectProfileContext = createContext({});

export const useProjectProfile = () => useContext(ProjectProfileContext);

function ProjectProfileProvider({ children }) {
  const params = useParams();
  const [isDashboardTab, setIsDashboardTab] = useState(false);
  
  const { data: project, isLoading, refetch: reFetchProject } = useQuery(
    ['showProject', { id: params.project_id }],
    projectsServices.showProject,
  );
  
  const [extraValues, setExtraValues] = useState({});

  const updateProjectProfile = (newValues) => {
    setExtraValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  document.title = project?.name;

  const contextValue = {
    project,
    ...extraValues,
    reFetchProject,
    isDashboardTab,
    setIsDashboardTab,
    updateProjectProfile, 
  };

  return (
    <ProjectProfileContext.Provider value={contextValue}>
      {children}
    </ProjectProfileContext.Provider>
  );
}

export default ProjectProfileProvider;
