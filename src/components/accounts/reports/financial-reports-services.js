import { readableDate } from "app/helpers/input-sanitization-helpers";
import axios from "app/services/config";

const financialReportsServices = {};

financialReportsServices.incomeStatement = async(params) => {
    const {data} = await axios.get(`income-statement`,{
        params
    })
    return data;
}

financialReportsServices.zReport = async(params) => {
  const {data} = await axios.get(`/tra-z-report`,{
      params
  })
  return data;
}

financialReportsServices.vfdReceipts = async(params) => {
  const {data} = await axios.get(`/vfd-receipts`,{
      params
  })
  return data;
}

financialReportsServices.trialBalance = async(params) => {
    const {data} = await axios.get(`trial-balance`,{
        params
    })
    return data;
}

financialReportsServices.codedTrialBalance = async(params) => {
  const {data} = await axios.get(`/coded-trial-balance`,{
      params
  })
  return data;
}

financialReportsServices.fetchCashierReport = async(params) => {
  const {data} = await axios.get(`/cashier-report`,{
      params
  })
  return data;
}

financialReportsServices.fetchSalesAndCashSummary = async(params) => {
  const {data} = await axios.get(`pos/sales-and-cash-summary`,{
      params
  })
  return data;
}

financialReportsServices.balanceSheet = async(params) => {
    const {data} = await axios.get(`balance-sheet`,{
        params : params,
        responseType: params.display_as === 'excel' ? 'blob' : 'json'
    })
    return data;
}

financialReportsServices.debtors = async(params) => {
  const {data} = await axios.get(`/debtors-report`,{
      params
  })
  return data;
}

financialReportsServices.creditors = async(params) => {
    const {data} = await axios.get(`/creditors-report`,{
        params
    })
    return data;
}


financialReportsServices.cashierReport = async({from,to,detailed,ledger_ids,groupBy}) => {
    const {data: reportData} = await axios.get(`cashier-report`,{
        params: {from,to,detailed,ledger_ids}
    });

    const groupedData = {};

    if(groupBy === 'day'){

        reportData.sales.forEach((sale) => {
            const clientDate = readableDate(sale.transaction_date);

            if (!groupedData[clientDate]) {
                groupedData[clientDate] = {
                    sales: [],
                    payments: [],
                    outgoingTransfers: [],
                    incomingTransfers: [],
                    receipts: []
                };
            }

            groupedData[clientDate].sales.push(sale);
        });

        reportData.receipts.forEach((receipt) => {
            const clientDate = readableDate(receipt.transactionDate);

            if (!groupedData[clientDate]) {
                groupedData[clientDate] = {
                    sales: [],
                    payments: [],
                    outgoingTransfers: [],
                    incomingTransfers: [],
                    receipts: []
                };
            }

            groupedData[clientDate].receipts.push(receipt);
        });

        reportData.payments.forEach((payment) => {
            const clientDate = readableDate(payment.transactionDate);

            if (!groupedData[clientDate]) {
                groupedData[clientDate] = {
                    sales: [],
                    payments: [],
                    outgoingTransfers: [],
                    incomingTransfers: [],
                    receipts: []
                };
            }

            groupedData[clientDate].payments.push(payment);
        });

        reportData.outgoingTransfers.forEach((transfer) => {
            const clientDate = readableDate(transfer.transactionDate);

            if (!groupedData[clientDate]) {
                groupedData[clientDate] = {
                    sales: [],
                    payments: [],
                    outgoingTransfers: [],
                    incomingTransfers: [],
                    receipts: []
                };
            }

            groupedData[clientDate].outgoingTransfers.push(transfer);
        });

        reportData.incomingTransfers.forEach((transfer) => {
            const clientDate = readableDate(transfer.transactionDate);

            if (!groupedData[clientDate]) {
                groupedData[clientDate] = {
                    sales: [],
                    payments: [],
                    outgoingTransfers: [],
                    incomingTransfers: [],
                    receipts: []
                };
            }

            groupedData[clientDate].incomingTransfers.push(transfer);
        });
    } else {

        const formattedData = {

            sales: reportData.sales.map((sale) => ({
              ...sale,
              period: new Date(sale.transaction_date).toLocaleString('default', groupBy === 'month' ? { month: 'long', year: 'numeric' } : { year: 'numeric' } ),
            })),
            receipts: reportData.receipts.map((receipt) => ({
              ...receipt,
              period: new Date(receipt.transactionDate).toLocaleString('default',  groupBy === 'month' ? { month: 'long', year: 'numeric' } : { year: 'numeric' }),
            })),
            payments: reportData.payments.map((payment) => ({
              ...payment,
              period: new Date(payment.transactionDate).toLocaleString('default',  groupBy === 'month' ? { month: 'long', year: 'numeric' } : { year: 'numeric' }),
            })),
            incomingTransfers: reportData.incomingTransfers.map((transfer) => ({
              ...transfer,
              period: new Date(transfer.transactionDate).toLocaleString('default',  groupBy === 'month' ? { month: 'long', year: 'numeric' } : { year: 'numeric' }),
            })),
            outgoingTransfers: reportData.outgoingTransfers.map((transfer) => ({
              ...transfer,
              period: new Date(transfer.transactionDate).toLocaleString('default',  groupBy === 'month' ? { month: 'long', year: 'numeric' } : { year: 'numeric' }),
            }))
        };

        formattedData.sales.forEach((sale) => {
            const { period } = sale;
            if (!groupedData[period]) {
              groupedData[period] = {
                sales: [],
                receipts: [],
                payments: [],
                outgoingTransfers: [],
                incomingTransfers: []
              };
            }
            groupedData[period].sales.push(sale);
          });
          
          formattedData.receipts.forEach((receipt) => {
            const { period } = receipt;
            if (!groupedData[period]) {
              groupedData[period] = {
                sales: [],
                receipts: [],
                payments: [],
                outgoingTransfers: [],
                incomingTransfers: []
              };
            }
            groupedData[period].receipts.push(receipt);
          });
          
          formattedData.payments.forEach((payment) => {
            const { period } = payment;
            if (!groupedData[period]) {
              groupedData[period] = {
                sales: [],
                receipts: [],
                payments: [],
                outgoingTransfers: [],
                incomingTransfers: []
              };
            }
            groupedData[period].payments.push(payment);
          });
          
          formattedData.incomingTransfers.forEach((transfer) => {
            const { period } = transfer;
            if (!groupedData[period]) {
              groupedData[period] = {
                sales: [],
                receipts: [],
                payments: [],
                outgoingTransfers: [],
                incomingTransfers: []
              };
            }
            groupedData[period].incomingTransfers.push(transfer);
          });

          formattedData.outgoingTransfers.forEach((transfer) => {
            const { period } = transfer;
            if (!groupedData[period]) {
              groupedData[period] = {
                sales: [],
                receipts: [],
                payments: [],
                outgoingTransfers: [],
                incomingTransfers: []
            
              };
            }
            groupedData[period].outgoingTransfers.push(transfer);
          });
    }

    return {openingBalance: reportData.openingBalance, groupedData};
}

financialReportsServices.incomeFigures =async (params) => {
  const {data} = await axios.get(`accounts/income-figures`, {
      params
  });
  return data;
}

financialReportsServices.profitAndLossFigures =async (params) => {
  const {data} = await axios.get(`accounts/profit-and-loss-figures`, {
      params
  });
  return data;
}

financialReportsServices.balanceSheetFigures =async (params) => {
  const {data} = await axios.get(`accounts/balance-sheet-figures`, {
      params
  });
  return data;
}

financialReportsServices.expenseFigures =async (params) => {
  const {data} = await axios.get(`accounts/expense-figures`, {
      params
  });
  return data;
}

financialReportsServices.inventoryValue =async (params) => {
  const {data} = await axios.get(`accounts/inventory-value`, {
      params
  });
  return data;
}

export default financialReportsServices;