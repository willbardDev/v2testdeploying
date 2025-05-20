import React, { createContext, useContext, ReactNode } from 'react';
import currencyServices from './currency-services';
import { LinearProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Currency } from './CurrencyType';

interface CurrencyContextValue {
    currencies?: Currency[];
}

const CurrencySelectContext = createContext<CurrencyContextValue>({});

export const useCurrencySelect = () => useContext(CurrencySelectContext);

interface CurrencySelectProviderProps {
    children: ReactNode;
}

function CurrencySelectProvider({ children }: CurrencySelectProviderProps) {
    const { data: currencies, isLoading } = useQuery<Currency[]>({
        queryKey: ['currencies'],
        queryFn: currencyServices.getList
    });

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <CurrencySelectContext.Provider value={{ currencies }}>
            {children}
        </CurrencySelectContext.Provider>
    );
}

export default CurrencySelectProvider;