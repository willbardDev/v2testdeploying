import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick'
import React from 'react'
import BudgetsActionTail from './BudgetsActionTail'
import CurrencySelectProvider from '../../masters/Currencies/CurrencySelectProvider'
import LedgerSelectProvider from '../ledgers/forms/LedgerSelectProvider'

function Budgets() {
  return (
    <CurrencySelectProvider>
      <LedgerSelectProvider>
        <JumboCardQuick
            title={'Budgets'}
            action={<BudgetsActionTail/>}
        >

        </JumboCardQuick>
      </LedgerSelectProvider>
    </CurrencySelectProvider>
  )
}

export default Budgets