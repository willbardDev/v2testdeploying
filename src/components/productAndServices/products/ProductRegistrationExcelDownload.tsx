import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogContent, DialogTitle, IconButton, Tab, Tabs, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { DownloadOutlined, UploadOutlined } from '@mui/icons-material';
import ExcelTemplateDownloadTab from './ExcelTemplateDownloadTab';
import ProductsExcelImport from './ProductsExcelImport';

function ProductRegistrationExcelDownload() {

  const [openDialog, setOpenDialog] = useState(false);
  const [content, setContent] = useState(0);

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={openDialog}
        maxWidth={'md'}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle textAlign={'center'}>{content === 0 ? `Download Template` : 'Upload Template'}</DialogTitle>
        <DialogContent>

          <Tabs 
            variant="fullWidth"
            allowScrollButtonsMobile
            value={content} onChange={(event, newValue) => setContent(newValue)}
          >
              <Tab label="Download" icon={<DownloadOutlined/>} />
              <Tab label="Upload" icon={<UploadOutlined/>}/>
          </Tabs>
          {
            content === 0 ? <ExcelTemplateDownloadTab  setOpenDialog={setOpenDialog} content={content}/> : <ProductsExcelImport setOpenDialog={setOpenDialog} content={content}/>
          }
        </DialogContent>
      </Dialog>
      <Tooltip title='Excel Template'>
        <IconButton size='small' onClick={() => setOpenDialog(true)}>
          <FontAwesomeIcon icon={faFileExcel} color='green' />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  )
}

export default ProductRegistrationExcelDownload