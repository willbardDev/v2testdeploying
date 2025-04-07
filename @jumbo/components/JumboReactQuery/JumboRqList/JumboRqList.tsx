import React from 'react';
import JumboList from "@jumbo/components/JumboList";
import { SxProps, Theme } from "@mui/material/styles";
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { getArrayElementFromKey } from '@jumbo/utilities/systemHelpers';
import { JumboListProps } from '@jumbo/types/JumboListProps';

interface QueryOptions<TQueryKey extends QueryKey> {
    queryKey: TQueryKey;
    queryParams?: Record<string, any>;
    countKey?: string;
    dataKey: string;
}

interface MultiSelectOption {
    label: React.ReactNode;
    selectionLogic: (items: any[]) => any[];
}

interface JumboRqListProps<TData = any> {
    queryOptions: QueryOptions<QueryKey>;
    itemsPerPage?: number;
    service: (params: any) => Promise<TData>;
    primaryKey: string;
    itemsPerPageOptions?: number[];
    toolbar?: React.ReactNode;
    multiSelectOptions?: MultiSelectOption[];
    onSelectionChange?: (selectedItems: any[]) => void;
    renderItem: (item: any, view?: 'list' | 'grid') => React.ReactNode;
    noDataPlaceholder?: React.ReactNode;
    wrapperComponent?: React.ElementType;
    wrapperSx?: SxProps<Theme>;
    component?: JumboListProps['component'];
    sx?: SxProps<Theme>;
    componentElement?: string | React.ElementType;
    itemSx?: SxProps<Theme>;
    transition?: boolean;
    view?: 'list' | 'grid';
    onRefresh?: () => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    disableTransition?: boolean;
}

interface QueryKeyParams {
    queryParams?: Record<string, any>;
    page: number;
    limit: number;
}

interface QueryData {
    data: any[];
    totalCount: number;
}

const JumboRqList = React.forwardRef<{ refresh: () => Promise<void> }, JumboRqListProps>(
    (props, ref) => {
    const {
        queryOptions,
        itemsPerPage = 10,
        service,
        primaryKey,
        itemsPerPageOptions,
        toolbar,
        multiSelectOptions,
        onSelectionChange,
        renderItem,
        noDataPlaceholder,
        wrapperComponent,
        wrapperSx,
        component,
        sx,
        componentElement,
        itemSx,
        transition,
        view,
        onRefresh = () => {},
    } = props;

    const listRef = React.useRef<any>(null);
    const queryClient = useQueryClient();
    
    const queryKey = React.useMemo(() => [
        queryOptions.queryKey,
        { queryParams: queryOptions.queryParams, page: 1, limit: itemsPerPage }
    ], [queryOptions.queryKey, queryOptions.queryParams, itemsPerPage]);

    const queryFn = React.useCallback(() => service(queryKey[1]), [service, queryKey]);

    const listQuery = useQuery({
        queryKey,
        queryFn,
    });

    React.useImperativeHandle(ref, () => ({
        async refresh() {
            listRef.current?.resetSelection();
            await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
            await listQuery.refetch();
            onRefresh();
        },
    }));

    const handlePageChange = React.useCallback((pageNumber: number) => {
        const newKey: QueryKey = [
            queryOptions.queryKey,
            {
                queryParams: queryOptions.queryParams,
                page: pageNumber + 1,
                limit: itemsPerPage
            }
        ];
        queryClient.setQueryData(queryKey, newKey);
    }, [queryOptions.queryParams, itemsPerPage, queryClient, queryOptions.queryKey, queryKey]);

    const handleItemsPerPageChange = React.useCallback(async (newValue: number) => {
        const newKey: QueryKey = [
            queryOptions.queryKey,
            {
                queryParams: queryOptions.queryParams,
                page: 1,
                limit: newValue
            }
        ];
        queryClient.setQueryData(queryKey, newKey);
        await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
        await listQuery.refetch();
        onRefresh();
    }, [queryClient, queryOptions.queryKey, queryKey, listQuery, onRefresh, queryOptions.queryParams]);

    const queryData: QueryData = React.useMemo(() => {
        const dataArray = getArrayElementFromKey(listQuery?.data, queryOptions?.dataKey);
        if (!Array.isArray(dataArray)) {
            return {
                data: [],
                totalCount: 0,
            };
        }
        return {
            data: dataArray,
            totalCount: getArrayElementFromKey(listQuery?.data, queryOptions.countKey) || 0,
        };
    }, [listQuery.data, queryOptions.dataKey, queryOptions.countKey]);

    return (
        <JumboList
            ref={listRef}
            data={queryData.data}
            primaryKey={primaryKey}
            renderItem={renderItem}
            itemsPerPage={itemsPerPage}
            totalCount={queryData.totalCount}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={itemsPerPageOptions}
            toolbar={toolbar}
            onSelectionChange={onSelectionChange}
            multiSelectOptions={multiSelectOptions}
            noDataPlaceholder={noDataPlaceholder}
            isLoading={listQuery.isLoading}
            wrapperComponent={wrapperComponent}
            wrapperSx={wrapperSx}
            componentElement={componentElement}
            itemSx={itemSx}
            component={component}
            sx={sx}
            // transition={transition}
            view={view}
        />
    );
});

export default JumboRqList;