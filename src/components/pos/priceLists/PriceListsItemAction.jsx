import { DeleteOutlined, DownloadOutlined, EditOutlined, MoreHorizOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Dialog,DialogContent,LinearProgress,Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import React, { lazy, useState } from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import JumboDdMenu from '@jumbo/components/JumboDdMenu/JumboDdMenu';
import priceListServices from './priceLists-services';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import PriceListPDF from './PriceListPDF';
import UnauthorizedAccess from 'app/shared/Information/UnauthorizedAccess';
import PDFContent from '../../pdf/PDFContent';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useJumboTheme } from '@jumbo/hooks';

const PriceListForm = lazy(() => import('./form/PriceListForm'));

const EditForm = ({priceList,toggleOpen}) => {
  const {data,isFetching} = useQuery(['priceList',{id:priceList.id}],() => priceListServices.show(priceList.id));
  if(isFetching){
    return <LinearProgress/>
  }
  return <PriceListForm priceList={data} toggleOpen={toggleOpen} />
}

const DocumentDialog = ({ priceList, authObject }) => {
  const { data, isLoading } = useQuery(['priceList', { id: priceList.id }], () =>
    priceListServices.show(priceList.id)
  );

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <DialogContent>
      {authObject.checkOrganizationPermission(PERMISSIONS.PRICE_LISTS_READ) ? (
        <PDFContent
          fileName={`PriceList From ${readableDate(priceList.effective_date)}`}
          document={<PriceListPDF authObject={authObject} priceList={data} />}
        />
      ) : (
        <UnauthorizedAccess />
      )}
    </DialogContent>
  );
};


const PriceListsItemAction = ({ priceList }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const { showDialog, hideDialog } = useJumboDialog();
  const authObject = useJumboAuth();
  const { checkOrganizationPermission } = authObject;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { mutate: deletePriceList } = useMutation(priceListServices.delete, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['priceLists']);
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data.message, { variant: 'error' });
    },
  });

  const menuItems = [
    {icon: belowLargeScreen ? <DownloadOutlined/> : <VisibilityOutlined/>, title: belowLargeScreen ? 'Download' : 'View', action: 'open'},
    checkOrganizationPermission(PERMISSIONS.PRICE_LISTS_EDIT) ? {icon: <EditOutlined/>, title: 'Edit', action: 'edit'} : null,
    checkOrganizationPermission(PERMISSIONS.PRICE_LISTS_DELETE) ? {icon: <DeleteOutlined color='error'/>, title: 'Delete', action: 'delete'} : null
  ];

  const handleItemAction = (menuItem) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'delete':
        showDialog({
          title: 'Confirm Price',
          content: 'Are you sure you want to delete this Price?',
          onYes: () => {
            hideDialog();
            deletePriceList(priceList.id);
          },
          onNo: () => hideDialog(),
          variant: 'confirm',
        });
        break;
      case 'open':
        setOpenDocumentDialog(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Dialog
        open={openEditDialog || openDocumentDialog}
        scroll={belowLargeScreen ? 'body' : 'paper'}
        fullWidth
        fullScreen={belowLargeScreen}
        onClose={()=> setOpenDocumentDialog(false)}
        maxWidth={openDocumentDialog ? "md" : "lg"}
      >
        {openEditDialog && (checkOrganizationPermission(PERMISSIONS.PRICE_LISTS_EDIT) ? (
          <EditForm priceList={priceList} toggleOpen={setOpenEditDialog} />
        ) : (
          <UnauthorizedAccess />
        ))}

        {openDocumentDialog && <DocumentDialog priceList={priceList} authObject={authObject}/>}
      </Dialog>

      <JumboDdMenu
        icon={
          <Tooltip title="Actions">
            <MoreHorizOutlined fontSize="small" />
          </Tooltip>
        }
        menuItems={menuItems}
        onClickCallback={handleItemAction}
      />
    </>
  );
};

export default PriceListsItemAction;
