import React from 'react';
import { Stack, TablePagination } from '@mui/material';
import useJumboList, { JumboListContextType } from '../../hooks/useJumboList';

interface JumboListPaginationProps {
    hidePagination?: boolean;
    hideItemsPerPage?: boolean;
}

const JumboListPagination: React.FC<JumboListPaginationProps> = ({
    hidePagination = false,
    hideItemsPerPage = false,
}) => {
    const {
        activePage,
        itemsPerPage,
        totalCount,
        isLoading,
        setActivePage,
        setItemsPerPage,
        itemsPerPageOptions,
        data,
    } = useJumboList() as JumboListContextType;

    return (
        <Stack p={1}>
            {
                !hidePagination && !(data?.length <= 0 && isLoading) && (
                    <TablePagination
                        component="div"
                        count={totalCount}
                        labelRowsPerPage="Rows"
                        page={activePage}
                        onPageChange={(_, nextPageNumber) => {
                            setActivePage(nextPageNumber);
                        }}
                        rowsPerPage={itemsPerPage}
                        onRowsPerPageChange={(event) => {
                            setItemsPerPage(Number(event.target.value));
                        }}
                        rowsPerPageOptions={hideItemsPerPage ? [] : itemsPerPageOptions}
                    />
                )
            }
        </Stack>
    );
};

export default JumboListPagination;
