import React from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { useProjectProfile } from '../../ProjectProfileProvider';
import { HighlightOff } from '@mui/icons-material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import treemap from "highcharts/modules/treemap";
import treegraph from 'highcharts/modules/treegraph';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import offlineExporting from 'highcharts/modules/offline-exporting';

if (typeof Highcharts === 'object') {
  treemap(Highcharts);
  treegraph(Highcharts);
  exporting(Highcharts);
  exportData(Highcharts);
  offlineExporting(Highcharts);
}

function TasksTreeView({ setOpenTasksTreeView }) {
  const { project, projectTimelineActivities } = useProjectProfile();

  const tasksTreeViewSeriesData = (groups) => {
    if (!Array.isArray(groups)) return [];
  
    const flattenGroups = (groupList, parentName = null) => {
      const sortedGroups = groupList.sort((a, b) => b.id - a.id);
  
      return sortedGroups.flatMap(group => {
        const groupNode = {
          id: 'activity_' + group.id,
          title: group.name,
          parent: parentName,
          nodeType: 'group'
        };
  
        const sortedTasks = (group.tasks || []).sort((a, b) =>  b.position_index - a.position_index);
  
        const taskNodes = sortedTasks.map(task => ({
          id: 'task_' + task.id,
          title: task.name,
          parent: 'activity_' + group.id,
          dependency: (task.dependencies || []).map(dep => 'task_' + dep.id),
          className: task.is_milestone ? 'milestone-task' : '',
          nodeType: 'task'
        }));
  
        const childGroupNodes = flattenGroups(group.children || [], 'activity_' + group.id);
  
        return [groupNode, ...taskNodes, ...childGroupNodes];
      });
    };
  
    return flattenGroups(groups);
  };
  

  const tasksTreeViewNodes = tasksTreeViewSeriesData(projectTimelineActivities);

  const chartOptions = {
    chart: {
      type: 'treegraph',
      inverted: false,
      backgroundColor: 'rgba(128,128,128,0.02)',
      borderWidth: 0,
      height: 3000,
      scrollablePlotArea: {
        minWidth: 2000,
      },
      spacingBottom: 100,
    },    
    title: {
      text: `${project.name} Tasks Tree View`,
      style: {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    series: [{
      type: 'treegraph',
      name: 'Project Tasks',
      data: tasksTreeViewNodes.map(node => ({
        id: node.id,
        parent: node.parent,
        name: node.title,
        className: node.className,
        nodeType: node.nodeType
      })),
      marker: {
        symbol: 'rect',
        width: '15%'
      },
      borderRadius: 10,
      colorByPoint: false,
      color: '#007ad0',
      dataLabels: {
        pointFormat: '{point.name}',
        style: {
          whiteSpace: 'nowrap', 
          fontSize: '12px' 
        }
      },
      borderColor: '#ccc',
      borderWidth: 1,
      nodeWidth: 80,
      nodeHeight: 25,
      layoutAlgorithm: {
        split: 'horizontal',
        nodeSpacing: 30,
        levelSpacing: 80  
      },
      levels: [
        {
          level: 1,
          levelIsConstant: false
        },
        {
          level: 2,
          colorByPoint: true
        },
        {
          level: 3,
          colorVariation: {
            key: 'brightness',
            to: -0.5
          }
        },
        {
          level: 4,
          colorVariation: {
            key: 'brightness',
            to: 0.5
          }
        }
      ]
    }],
    tooltip: {
      outside: true,
      formatter: function () {
        const { name, nodeType } = this.point;
        return `<b>${name}</b><br>Type: ${nodeType}`;
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500 
        },
        chartOptions: {
          chart: {
            height: '300px'
          },
          series: [{
            nodeWidth: 50, 
            nodeHeight: 20
          }]
        }
      }]
    }
  };

  return (
    <>
      <DialogTitle sx={{ textAlign: 'center', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', border: 'none' }}>
        <Tooltip title="Close">
          <IconButton
            size="small"
            color="primary"
            onClick={() => setOpenTasksTreeView(false)}
          >
            <HighlightOff color="primary" />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType="chart"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenTasksTreeView(false)}>Close</Button>
      </DialogActions>
    </>
  );
}

export default TasksTreeView;
