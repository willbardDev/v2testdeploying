import React from 'react';
import { Stack, Pagination, PaginationItem, Tooltip } from '@mui/material';
import useJumboList, { JumboListContextType } from '../../hooks/useJumboList';
import { useDictionary } from '@/app/[lang]/contexts/DictionaryContext';

interface JumboListPaginationProps {
    hidePagination?: boolean;
}

const JumboListPagination: React.FC<JumboListPaginationProps> = ({
    hidePagination = false,
}) => {
    const {
        activePage,
        itemsPerPage,
        totalCount,
        isLoading,
        setActivePage,
        data,
    } = useJumboList() as JumboListContextType;
    const dictionary = useDictionary();

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Default pagination translations structure
    const paginationTranslations = dictionary.rqList?.pagination || {
        first: 'Go to first page',
        last: 'Go to last page',
        previous: 'Previous page',
        next: 'Next page',
        page: 'Go to page {page}',
        ellipsis: 'More pages'
    };

    const getTooltipTitle = (item: {
        type: string;
        page: number | null;
    }): string => {
        switch (item.type) {
            case 'first':
                return paginationTranslations.first;
            case 'last':
                return paginationTranslations.last;
            case 'previous':
                return paginationTranslations.previous;
            case 'next':
                return paginationTranslations.next;
            case 'page':
                return item.page 
                    ? paginationTranslations.page.replace('{page}', item.page.toString())
                    : '';
            case 'start-ellipsis':
            case 'end-ellipsis':
                return paginationTranslations.ellipsis;
            default:
                return '';
        }
    };

    return (
        <Stack 
            direction="row"
            justifyContent="flex-end"
            p={1}
            width="100%" 
        >
            {!hidePagination && !(data?.length <= 0 && isLoading) && (
                <Pagination
                    count={totalPages}
                    page={activePage + 1}
                    onChange={(_, page) => setActivePage(page - 1)}
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    renderItem={(item) => (
                        <Tooltip title={getTooltipTitle(item)} arrow>
                            <PaginationItem {...item} />
                        </Tooltip>
                    )}
                />
            )}
        </Stack>
    );
};

export default JumboListPagination;