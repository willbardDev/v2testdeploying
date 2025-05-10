import React from 'react';
import { Stack, TablePagination } from '@mui/material';
import useJumboList, { JumboListContextType } from '../../hooks/useJumboList';
import { useDictionary } from '@/app/[lang]/contexts/DictionaryContext';

interface JumboListPaginationProps {
    hidePagination?: boolean;
    hideItemsPerPage?: boolean;
}

const JumboListPagination: React.FC<JumboListPaginationProps> = ({
    hidePagination = false,
    hideItemsPerPage = false,
}) => {
    const dictionary = useDictionary();

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
                        labelRowsPerPage={dictionary.rqList.rows}
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
