import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ledgerServices from '../ledger-services';

const LedgerSelectContext = createContext({});

export const useLedgerSelect = () => useContext(LedgerSelectContext);

function LedgerSelectProvider({ children }) {
  const [ungroupedLedgerOptions, setUngroupedLedgerOptions] = useState([]);
  const { data: ledgerOptions, isFetched } = useQuery('ledgerOptions', ledgerServices.getLedgerOptions,{
    refetchOnWindowFocus: true
  });

  const extractLedgers = (ledgerGroups, notAllowedGroups, allowedGroups, setOptions, mainNatureId = null, allowChildren = false) => {
    ledgerGroups?.forEach(group => {
      const currentNatureId = mainNatureId ?? group.nature_id;

      if (!notAllowedGroups.includes(group.original_name) && (allowedGroups.length === 0 || allowedGroups.includes(group.original_name) || allowChildren)) {
        group?.ledgers?.forEach(ledger => 
          setOptions(options => [...options, { id: ledger.id, name: ledger.name, nature_id: currentNatureId, ledger_group_id: ledger.ledger_group_id }])
        );

        extractLedgers(group.children_with_ledgers, notAllowedGroups, allowedGroups, setOptions, currentNatureId, true);
      } else { 
        extractLedgers(group.children_with_ledgers, notAllowedGroups, allowedGroups, setOptions, group.nature_id, false);
      }
    });
  };

  useEffect(() => {
    if (isFetched) {
      setUngroupedLedgerOptions([]);
      extractLedgers(ledgerOptions, [], [], setUngroupedLedgerOptions, null);
    }
  }, [ledgerOptions, isFetched]);

  return (
    <LedgerSelectContext.Provider value={{ 
      ledgerOptions, 
      ungroupedLedgerOptions,
      extractLedgers
    }}>
      {children}
    </LedgerSelectContext.Provider>
  );
}

export default LedgerSelectProvider;
