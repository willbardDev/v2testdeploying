import React, { lazy, useState } from 'react';
import { Alert, Grid, ListItemText, Stack, Typography, Divider, Tooltip, useMediaQuery } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import JumboSearch from '@jumbo/components/JumboSearch';
import { useJumboTheme } from '@jumbo/hooks';
import WBSActionTail from './WBSActionTail';
import { useProjectProfile } from '../ProjectProfileProvider';
import WBSItemAction from './WBSItemAction';
import TasksActionTail from './task/TasksActionTail';
import TasksListItem from './task/TasksListItem';
import TasksTreeViewActionTail from './tasksTreeView/TasksTreeViewActionTail';

const GanttChartActionTail = lazy(() => import('./ganttChart/GanttChartActionTail'));

const TimelineActivityAccordion = ({ activity, expanded, handleChange }) => {
  const [childExpanded, setChildExpanded] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = activity?.tasks?.filter(task => {
    const description = task.description?.toLowerCase() || '';
    const name = task.name?.toLowerCase() || '';

    return description.includes(searchQuery.toLowerCase()) ||
           name.includes(searchQuery.toLowerCase());
  });

  const filterActivityChildren = (children) => {
    return children
      .filter(child => 
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (child.description && child.description.toLowerCase().includes(searchQuery.toLowerCase())) || 
        child.tasks?.some(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .map(child => ({
        ...child,
        tasks: child.tasks?.filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase())),
        children: filterActivityChildren(child.children)
      }));
  };  

  const filteredChildren = filterActivityChildren(activity?.children || []);

  const handleChildChange = (childIndex) => {
    setChildExpanded((prevState) => ({
      ...prevState,
      [childIndex]: !prevState[childIndex],
    }));
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      square
      sx={{
        borderRadius: 2,
        borderTop: 2,
        width: '100%',  // Ensure it takes the full width of the container
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        '& > .MuiAccordionDetails-root:hover': {
          bgcolor: 'transparent',
        },
      }}
    >
      <AccordionSummary
        expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
        sx={{
          px: 3,
          flexDirection: 'row-reverse',
          '.MuiAccordionSummary-content': {
            alignItems: 'center',
            '&.Mui-expanded': {
              margin: '12px 0',
            },
          },
          '.MuiAccordionSummary-expandIconWrapper': {
            borderRadius: 1,
            border: 1,
            color: 'text.secondary',
            transform: 'none',
            mr: 1,
            '&.Mui-expanded': {
              transform: 'none',
              color: 'primary.main',
              borderColor: 'primary.main',
            },
            '& svg': {
              fontSize: '1.25rem',
            },
          },
        }}
      >
        <Grid container paddingLeft={0.1} paddingRight={0.1} columnSpacing={1} rowSpacing={1} alignItems={'center'}>
          <Grid item xs={8} md={5.5}>
            <ListItemText
              primary={
                <Tooltip title={'Activity Name'}>
                  <Typography component="span">{activity.name}</Typography>
                </Tooltip>
              }
              secondary={
                <Tooltip title={'Code'}>
                  <Typography component="span">{activity.code}</Typography>
                </Tooltip>
              }
            />
          </Grid>
          {activity.description &&
            <Grid item xs={8} md={5.5}>
              <ListItemText
                secondary={
                  <Tooltip title={'Description'}>
                    <Typography component="span">{activity.description}</Typography>
                  </Tooltip>
                }
              />
            </Grid>
          }
          <Grid item xs={4} md={activity.description ? 1 : 6.5} textAlign={'end'}>
            <WBSItemAction activity={activity} />
          </Grid>
        </Grid>
        <Divider />
      </AccordionSummary>

      <AccordionDetails
        sx={{
          backgroundColor: 'background.paper',
          marginBottom: 3,
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Grid container>
          <Grid item xs={12} textAlign={'end'} display="flex" justifyContent="flex-end" alignItems="center">
            {(activity.children?.length > 0 || activity.tasks.length > 0) &&
              <Grid item paddingBottom={1} >
                <JumboSearch
                  value={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
                />
              </Grid>
            }
            <Grid item>
              {!activity.children.length > 0 && <TasksActionTail openDialog={openDialog} setOpenDialog={setOpenDialog} activity={activity} />}
            </Grid>
            <Grid item>
              {!activity.tasks?.length > 0 && <WBSItemAction activity={activity} isAccDetails={true} />}
            </Grid>
          </Grid>

          {/* Tasks List Item */}
          <TasksListItem filteredTasks={filteredTasks} activity={activity}/>

          {/* Render child activity as nested Accordions */}
          {filteredChildren.length > 0 && (
            <Grid item xs={12}>
              {filteredChildren.map((child, index) => (
                <TimelineActivityAccordion
                  key={index}
                  activity={child}
                  expanded={!!childExpanded[index]} 
                  handleChange={() => handleChildChange(index)}
                  openDialog={openDialog}
                  setOpenDialog={setOpenDialog}
                />
              ))}
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

function WBSListItem() {
  const { projectTimelineActivities } = useProjectProfile();
  const [openDialog, setOpenDialog] = useState(false);
  const [expanded, setExpanded] = useState(Array(projectTimelineActivities?.length).fill(false));
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimelineActivity = projectTimelineActivities?.filter(activity =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activity.description && activity.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedTimelineActivity = filteredTimelineActivity?.sort((a, b) => {
    if (a.position_index === null) return 1; 
    if (b.position_index === null) return -1;
    return a.position_index - b.position_index;
  });

  const handleChange = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const { theme } = useJumboTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <React.Fragment>
      <Grid container columnSpacing={1} justifyContent="flex-end" alignItems="center">
        {projectTimelineActivities?.length > 0 &&
          <Grid item>
            <JumboSearch
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </Grid>
        }
        {isLargeScreen &&
          <Grid item>
            <GanttChartActionTail/>
          </Grid>
        }
        {isLargeScreen &&
          <Grid item>
            <TasksTreeViewActionTail/>
          </Grid>
        }
        <Grid item>
          <WBSActionTail openDialog={openDialog} setOpenDialog={setOpenDialog} activity={null}/>
        </Grid>
      </Grid>
      <Stack direction={'column'}>
        {sortedTimelineActivity?.length > 0 ? (
          sortedTimelineActivity.map((activity, index) => (
            <TimelineActivityAccordion
              key={index}
              activity={activity}
              expanded={expanded[index]}
              handleChange={() => handleChange(index)}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
            />
          ))
        ) : (
          <Alert variant="outlined" color="primary" severity="info">
            No Timeline Activity Found
          </Alert>
        )}
      </Stack>
    </React.Fragment>
  );
}

export default WBSListItem;
