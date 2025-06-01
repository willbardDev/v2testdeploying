import { Divider, Grid, Tooltip, Typography, Link, ListItemText } from '@mui/material';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileImage, faFileVideo, faFileWord, faFileExcel, faFilePowerpoint, faFileAlt, faFileAudio } from '@fortawesome/free-solid-svg-icons';
import { readableDate } from 'app/helpers/input-sanitization-helpers';

// Define colors for different file types
const iconColors = {
  pdf: '#D32F2F',         // Red for PDF
  jpeg: '#1976D2',        // Blue for Images
  jpg: '#1976D2',
  png: '#1976D2',
  gif: '#1976D2',
  bmp: '#1976D2',
  svg: '#1976D2',
  webp: '#1976D2',
  mp4: '#F57C00',         // Orange for Videos
  mov: '#F57C00',
  avi: '#F57C00',
  mkv: '#F57C00',
  wmv: '#F57C00',
  mp3: '#7B1FA2',         // Purple for Audio
  doc: '#388E3C',         // Green for Word documents
  docx: '#388E3C',
  xls: '#FBC02D',         // Yellow for Excel spreadsheets
  xlsx: '#FBC02D',
  ppt: '#C2185B',         // Pink for PowerPoint presentations
  pptx: '#C2185B',
  default: '#757575',    // Gray for unknown file types
};

// Map file types to FontAwesome icons 
const fileTypeIcon = {
  pdf: faFilePdf,
  jpeg: faFileImage,
  jpg: faFileImage,
  png: faFileImage,
  gif: faFileImage,
  bmp: faFileImage,
  svg: faFileImage,
  webp: faFileImage,
  mp4: faFileVideo,
  mov: faFileVideo,
  avi: faFileVideo,
  mkv: faFileVideo,
  wmv: faFileVideo,
  mp3: faFileAudio,
  doc: faFileWord,
  docx: faFileWord,
  xls: faFileExcel,
  xlsx: faFileExcel,
  ppt: faFilePowerpoint,
  pptx: faFilePowerpoint,
  default: faFileAlt,
};

function FilesShelfListItem({ attachment }) {
  const fileType = attachment.file_type.toLowerCase(); // Extract file extension and convert to lowercase
  const icon = fileTypeIcon[fileType] || fileTypeIcon.default; // Get the icon for the file type
  const iconColor = iconColors[fileType] || iconColors.default; // Get color for the icon

  return (
    <React.Fragment>
      <Divider />
      <Grid
        container 
        columnSpacing={2}   
        alignItems={'center'}
        sx={{
            cursor: 'pointer',
            borderColor: 'divider',
            '&:hover': {
            bgcolor: 'action.hover',
            },
            paddingTop: 2,
            paddingLeft: 3,
            paddingRight:2,
        }}
      >
        <Grid item xs={3} md={0.5} lg={0.5}>
          <Tooltip title={`Open ${attachment.attachmentable_type} file`}>
            <Link href={attachment.full_path} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon size='lg' icon={icon} color={iconColor} />
            </Link>
          </Tooltip>
        </Grid>
        <Grid item xs={9} md={4}>
          <Tooltip title={attachment.name}>
            <Link href={attachment.full_path} target="_blank" rel="noopener noreferrer">
              <Typography>{attachment.name}</Typography>
            </Link>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={2.5} lg={2.5}>
            <ListItemText
              primary={
                <Tooltip title={'Relatable Type'}>
                  <Typography variant={"span"} lineHeight={1.25} mb={0}
                    noWrap>{attachment.attachmentable_type}
                  </Typography>
                </Tooltip>
              }
              secondary={
                <Tooltip title={'Relatable No'}>
                  <Typography variant={"span"} lineHeight={1.25} mb={0}
                      noWrap>{attachment.attachmentableNo}
                  </Typography>
                </Tooltip>
              }
            />
        </Grid>
        <Grid item xs={6} md={2.5} lg={2.5}>
            <ListItemText
              primary={
                <Tooltip title={'Created'}>
                  <Typography variant={"span"} lineHeight={1.25} mb={0}
                    noWrap>{readableDate(attachment.created_at, true)}
                  </Typography>
                </Tooltip>
              }
            />
        </Grid>
        <Grid item xs={6} md={2.5} lg={2.5}>
            <ListItemText
              primary={
                <Tooltip title={'Modified'}>
                  <Typography variant={"span"} lineHeight={1.25} mb={0}
                      noWrap>{readableDate(attachment.updated_at, true)}
                  </Typography>
                </Tooltip>
              }
            />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default FilesShelfListItem;
