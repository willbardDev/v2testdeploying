import { deviceType } from '@/utilities/helpers/user-agent-helpers';
import { LinearProgress } from '@mui/material';
import React, { lazy, ReactNode } from 'react';

// Define types for the PDF document
type PDFDocument = React.ReactElement<typeof Document>;

// Props type for the PDFContent component
interface PDFContentProps {
  document: PDFDocument;
  fileName?: string;
}

// Lazy load the PDF components with proper typing
const PDFDownloadLink = lazy(() => 
  import('@react-pdf/renderer').then(module => ({ 
    default: module.PDFDownloadLink as React.ComponentType<{
      document: PDFDocument;
      fileName: string;
      style?: React.CSSProperties;
      children: (params: { loading: boolean }) => ReactNode;
    }>
  }))
);

const PDFViewer = lazy(() => 
  import('@react-pdf/renderer').then(module => ({ 
    default: module.PDFViewer as React.ComponentType<{
      width: string | number;
      height: string | number;
      children: PDFDocument;
    }>
  }))
);

const PDFContent: React.FC<PDFContentProps> = ({ document, fileName = 'ProsERP document' }) => {
  const isMobile = deviceType() === 'mobile';
  
  return isMobile ? (
    <PDFDownloadLink 
      style={{ textAlign: 'center' }} 
      document={document} 
      fileName={`${fileName}.pdf`}
    >
      {({ loading }) => (loading ? <LinearProgress/> : `Download ${fileName} PDF`)}
    </PDFDownloadLink>
  ) : (
    <PDFViewer width={'100%'} height={'600'}>
      {document}
    </PDFViewer>
  );
};

export default PDFContent;