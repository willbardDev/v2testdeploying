import React, { lazy, useEffect, useState } from 'react';
import { Card, LinearProgress, Stack, Tab, Tabs, Typography } from '@mui/material';
import JumboContentLayout from '@jumbo/components/JumboContentLayout';
import ProjectDashboard from './dashboard/ProjectDashboard';
import ProjectProfileProvider, { useProjectProfile } from './ProjectProfileProvider';
import { useQuery } from '@tanstack/react-query';
import projectsServices from '../project-services';
import StakeholderSelectProvider from '@/components/masters/stakeholders/StakeholderSelectProvider';
import CurrencySelectProvider from '@/components/masters/Currencies/CurrencySelectProvider';

// const AttachmentForm = lazy(() => import('@/components/filesShelf/attachments/AttachmentForm'));
// const Subcontracts = lazy(() => import('./subcontracts/Subcontracts'));
// const TimelineActivitiesListItem = lazy(() => import('./wbs/WBSListItem'));
// const Deliverables = lazy(() => import('./deliverables/DeliverableGroupsListItem'));
// const Budgets = lazy(() => import('./budgets/BudgetsListItem'));
// const Updates = lazy(() => import('./updates/Updates'));

function ProfileContent() {
  const { project, updateProjectProfile, setIsDashboardTab } = useProjectProfile();
  const [activeTab, setActiveTab] = useState(0);
  const [fetchDeliverables, setFetchDeliverables] = useState(false);
  const [fetchTimelineActivities, setFetchTimelineActivities] = useState(false);

  const isLoadingState = {
    deliverables: false,
    budgets: false,
    timeline: false,
    updates: false,
  };

  const { isLoading: isDeliverablesLoading } = useQuery(
    ['projectDeliverableGroups', { id: project.id }],
    () => projectsServices.showDeliverablesAndGroups(project.id),
    {
      enabled: activeTab === 3 || fetchDeliverables,
      onSuccess: (data) => {
        updateProjectProfile({ deliverable_groups: data });
      },
    }
  );
  isLoadingState.deliverables = isDeliverablesLoading;

  const { isLoading: isBudgetLoading } = useQuery(
    ['projectBudgets', { id: project.id, cost_center: project.cost_center.id }],
    projectsServices.showProjectBudgets,
    {
      enabled: activeTab === 4,
      onSuccess: (data) => {
        updateProjectProfile({ projectBudgets: data.data });
      },
    }
  );
  isLoadingState.budgets = isBudgetLoading;

  const { isLoading: isTimelineActivitiesLoading } = useQuery(
    ['projectTimelineActivities', { id: project.id }],
    () => projectsServices.showProjectTimelineActivities(project.id),
    {
      enabled: activeTab === 1 || fetchTimelineActivities,
      onSuccess: (data) => {
        updateProjectProfile({ projectTimelineActivities: data });
      },
    }
  );
  isLoadingState.timeline = isTimelineActivitiesLoading;

  const { isLoading: isUpdatesLoading } = useQuery(
    ['projectUpdates', { id: project.id }],
    () => projectsServices.projectUpdatesList(project.id),
    {
      enabled: activeTab === 2,
      onSuccess: (data) => {
        updateProjectProfile({ projectUpdates: data });
      },
    }
  );
  isLoadingState.updates = isUpdatesLoading;

  useEffect(() => {
    setIsDashboardTab(activeTab === 0);
  }, [activeTab]);
  
  useEffect(() => {
    if (fetchDeliverables || fetchTimelineActivities || activeTab !== 0) {
      updateProjectProfile({
        setFetchDeliverables,
        setFetchTimelineActivities,
        activeTab,
        deliverablesLoading: isDeliverablesLoading,
        budgetsLoading: isBudgetLoading,
        timelineLoading: isTimelineActivitiesLoading,
        updatesLoading: isUpdatesLoading,
      });
    }
  }, [activeTab, isDeliverablesLoading, isBudgetLoading, isTimelineActivitiesLoading, isUpdatesLoading]);  

  const isLoading = !fetchDeliverables && !fetchTimelineActivities && Object.values(isLoadingState).some(Boolean);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <StakeholderSelectProvider>
            <ProjectDashboard />
          </StakeholderSelectProvider>
        );
      // case 1:
      //   return <TimelineActivitiesListItem />;
      // case 2:
      //   return <Updates />;
      // case 3:
      //   return <Deliverables />;
      // case 4:
      //   return <Budgets />;
      // case 5:
      //   return <Subcontracts />;
      // case 6:
      //   return (
      //     <AttachmentForm
      //       hideFeatures
      //       attachment_sourceNo={project.projectNo}
      //       attachmentable_type="project"
      //       attachmentable_id={project.id}
      //     />
      //   );
      default:
        return null;
    }
  };

  return (
    <JumboContentLayout
      header={
        <>
          <Typography variant="h4">{project.name}</Typography>
          <Typography variant="body1">{project.reference}</Typography>
        </>
      }
    >
      <Card sx={{ height: '100%', padding: 1 }}>
        <Stack spacing={1} direction="column">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Dashboard" />
            {/* <Tab label="WBS" />
            <Tab label="Updates" />
            <Tab label="Deliverables" />
            <Tab label="Budgets" />
            <Tab label="Subcontracts" />
            <Tab label="Attachments" /> */}
          </Tabs>
          {!fetchDeliverables && !fetchTimelineActivities && isLoading ? (
            <LinearProgress />
          ) : (
            renderTabContent()
          )}
        </Stack>
      </Card>
    </JumboContentLayout>
  );  
}

function ProjectProfile() {
  return (
    <ProjectProfileProvider>
      <CurrencySelectProvider>
        <ProfileContent />
      </CurrencySelectProvider>
    </ProjectProfileProvider>
  );
}

export default ProjectProfile;
