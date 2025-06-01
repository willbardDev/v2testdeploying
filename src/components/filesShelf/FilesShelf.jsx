import React, { useState } from 'react';
import { Card, Grid, IconButton, Tooltip } from "@mui/material";
import { useParams } from "react-router";
import JumboSearch from "@jumbo/components/JumboSearch";
import JumboListToolbar from "@jumbo/components/JumboList/components/JumboListToolbar";
import filesShelfServices from "./filesShelfServices";
import JumboRqList from "@jumbo/components/JumboReactQuery/JumboRqList";
import FilesShelfListItem from "./FilesShelfListItem";
import AttachmentablesSelector from "./AttachmentablesSelector";
import FileTypesSelector from "./FileTypesSelector";
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { EventAvailableOutlined } from '@mui/icons-material';
import UnsubscribedAccess from 'app/shared/Information/UnsubscribedAccess';

function FilesShelf() {
  const params = useParams();
  const listRef = React.useRef();
  const {authOrganization} = useJumboAuth();
  const [filterDate, setFilterDate] = useState({})

  const [queryOptions, setQueryOptions] = React.useState({
    queryKey: "filesShelf",
    queryParams: { id: params.id, keyword: '', attachmentables: [], extensions: [] },
    countKey: "total",
    dataKey: "data",
  });

  React.useEffect(() => {
    setQueryOptions(state => ({
      ...state,
      queryParams: { ...state.queryParams, id: params.id }
    }));
  }, [params]);

  const renderAttachments = React.useCallback((attachment) => {
    return <FilesShelfListItem attachment={attachment} />;
  }, []);

  const handleAttachmentableChange = React.useCallback((attachmentables) => {
    setQueryOptions(state => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        attachmentables: attachmentables
      }
    }));
  }, []);

  const handleFileTypesChange = React.useCallback((extensions) => {
    setQueryOptions(state => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        extensions: extensions
      }
    }));
  }, []);
  
  const handleOnChange = React.useCallback((keyword) => {
    setQueryOptions(state => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        keyword: keyword,
      }
    }));
  }, []);

  if(!authOrganization?.organization?.active_subscriptions?.length > 0){
    return <UnsubscribedAccess/>
  }

  return (
    <JumboRqList
      ref={listRef}
      wrapperComponent={Card}
      service={filesShelfServices.getList}
      primaryKey={"id"}
      queryOptions={queryOptions}
      itemsPerPage={10}
      itemsPerPageOptions={[8, 10, 15, 20, 30, 50]}
      renderItem={renderAttachments}
      componentElement={"div"}
      bulkActions={null}
      wrapperSx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
      toolbar={
        <JumboListToolbar
          hideItemsPerPage={true}
          action={
            <Grid container columnSpacing={1} rowSpacing={1}>
              <Grid item xs={12} md={6} lg={2.6}>
                <AttachmentablesSelector
                  value={queryOptions.queryParams.attachmentables}
                  onChange={handleAttachmentableChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={2.6} alignItems={'center'}>
                <FileTypesSelector
                  value={queryOptions.queryParams.extensions}
                  onChange={handleFileTypesChange}
                />
              </Grid>
              <Grid item xs={11} md={6} lg={3.2}>
                <DateTimePicker
                  label="From"
                  defaultValue={filterDate.from ? dayjs(filterDate.from) : null}
                  minDate={dayjs(authOrganization?.organization?.recording_start_date)}
                  slotProps={{
                    textField : {
                      size: 'small',
                      fullWidth: true,
                    }
                  }}
                  onChange={(value) => {
                    setFilterDate((filters) => { return {...filters,from: value.toISOString()}; });
                  }}
                />
              </Grid>
              <Grid item xs={11} md={5} lg={3.2}>
                <DateTimePicker
                  label="To"
                  defaultValue={ filterDate.to ? dayjs(filterDate.to) : null}
                  minDate={dayjs(filterDate.from)}
                  slotProps={{
                    textField : {
                      size: 'small',
                      fullWidth: true,
                    }
                  }}
                  onChange={(value) => {
                    setFilterDate((filters) => { return {...filters,to: value.toISOString()}; });
                  }}
                />
              </Grid>
              <Grid item xs={1} md={1} lg={0.4} alignContent={'end'}>
                <Tooltip title="Filter Dates">
                  <IconButton onClick={() => {
                    setQueryOptions(state => ({
                      ...state,
                      queryParams: {
                        ...state.queryParams,
                        from: filterDate.from,
                        to: filterDate.to
                      }
                    }));
                  }}>
                    <EventAvailableOutlined/>
                  </IconButton> 
                </Tooltip>   
              </Grid>
            </Grid>
          }
          actionTail={
            <JumboSearch
              onChange={handleOnChange}
              value={queryOptions.queryParams.keyword}
            />
          }
        />
      }
    />
  );
}

export default FilesShelf;
