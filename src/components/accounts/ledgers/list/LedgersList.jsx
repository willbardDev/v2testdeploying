import JumboListToolbar from "@jumbo/components/JumboList/components/JumboListToolbar";
import JumboRqList from "@jumbo/components/JumboReactQuery/JumboRqList";
import JumboSearch from "@jumbo/components/JumboSearch";
import { Card, Grid, Stack } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import ledgerServices from "../ledger-services";
import LedgerSelectProvider from "../forms/LedgerSelectProvider";
import LedgerActionTail from "./LedgerActionTail";
import LedgerListItem from "./LedgerListItem";

const LedgersList = () => {

    const params = useParams();
    const listRef = React.useRef();

    const renderLedgerItem = React.useCallback((ledgerItem) => {
        return <LedgerListItem ledger={ledgerItem} />
    });

    React.useEffect(() => {
        setQueryOptions(state => ({
            ...state,
            queryParams: { category: params.category, id: params.id, keyword: params.keyword}
        }))
    }, [params]);

    const [queryOptions, setQueryOptions] = React.useState({
        queryKey: "ledgers-list",
        queryParams: {category: params.category, id: params.id, keyword: params.keyword},
        countKey: "total",
        dataKey: "data"
    });

    const handleOnChange = React.useCallback((keyword) => {
        setQueryOptions(state => ({
            ...state,
            queryParams: {
                ...state.queryParams,
                keyword: keyword,
            }
        }))
    }, []);

    return (
        <LedgerSelectProvider>
            <JumboRqList
                ref={listRef}
                dense={true}
                wrapperComponent={Card}
                queryOptions={queryOptions}
                primaryKey={"id"}
                service={ledgerServices.getLedgers}
                renderItem={renderLedgerItem}
                itemsPerPage={10}
                itemsPerPageOptions={[10,15,30,60]}
                componentElement={'div'}
                wrapperSx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                toolbar={
                    <JumboListToolbar
                        hideItemsPerPage={true}
                        actionTail={
                            <Grid container columnSpacing={1} direction={'row'}>
                                <Grid item xs={9.5} lg={10}>
                                    <JumboSearch
                                        onChange={handleOnChange}
                                        value={queryOptions.queryParams.keyword}
                                    /> 
                                </Grid>
                                <Grid item xs={2.5} lg={2}>
                                    <LedgerActionTail/>
                                </Grid>
                            </Grid>
                        }
                    >
                    </JumboListToolbar>
                }
            />
        </LedgerSelectProvider>
    );
}

export default LedgersList;