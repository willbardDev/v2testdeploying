import axios from "@/lib/services/config";

const posServices = {};

posServices.getUserOutlets = async (params) => {
    const { userId } = params;
    const { data } = await axios.get(`/api/pos/counter/${userId}/getUserOutlets`);
    return data;
};

posServices.getCounterLedgers = async(counter_id) => {
    const {data} = await axios.get(`pos/sales_counter/${counter_id}/ledgers`);
    return data;
}

posServices.getCounterSales = async ({ counterId, keyword, page, limit, from, to }) => {
  const response = await axios.get(`/api/pos/counter/${counterId}/getCounterSales`, {
    params: { counterId, keyword, page, limit, from, to },
  });
  return response.data;
};

posServices.salesManifest = async(params) => {
    const {data} = await axios.get(`pos/sales-manifest`,{
        params
    });
    return data;
}

posServices.addSale = async(sale) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`pos/sale`,sale);
         return data;
     })
}

posServices.postSaleToVFD = async(saleData) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`pos/sale/post_to_vfd`,saleData);
         return data;
     })
}

posServices.updateSale = async(sale) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`pos/sale/${sale.id}`,sale)
        return data;
    })
}

posServices.getSaleComplements = async (sale) => {
    const {data} = await axios.get(`pos/sale/${sale.id}/edit_complements`);
    return data;
};

posServices.deleteSale = async (sale) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`pos/sale/${sale.id}`);
        return data;
    })
};

posServices.saleDetails = async (id) => {
    const {data} = await axios.get(`pos/sale/${id}`);
    return data;
}

posServices.salesFigures = async (params) => {
    const {data} = await axios.get(`pos/sales-figures-report`, {
        params
    });
    return data;
};

posServices.productSales = async (params) => {
    const {data} = await axios.get(`product-sales`, {
        params
    });
    return data;
};

posServices.getLastPrice = async(params) => {
    const {data} = await axios.get(`/stakeholders/product-last-price/selling`,{
        params
    });
    return data;
}

posServices.dispatchSale = async(dispatchSale) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/pos/delivery-note`,dispatchSale);
         return data;
     })
}

posServices.invoiceSale = async(invoiceSale) => {
    const id = invoiceSale.id
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/accounts/invoice-sale/${id}`,invoiceSale);
         return data;
     })
}

posServices.receiptSale = async(invoiceSale) => {
    const id = invoiceSale.id
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
         const {data} = await axios.post(`/pos/sale/${id}/receipts`,invoiceSale);
         return data;
     })
}

posServices.deliveryNotesSalesItems = async(params) => {
    const {data} = await axios.get(`/pos/delivery-notes/invoice-items`,{
        params
    });
    return data;
}

posServices.updateDeliveryNote = async(deliveryNote) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`pos/delivery-note/${deliveryNote.id}`,deliveryNote)
        return data;
    })
}

posServices.updateInvoice = async(invoice) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(`/accounts/customer-invoices/${invoice.id}`,invoice)
        return data;
    })
}

posServices.updateSaleInvoice = async(invoice) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.put(``,invoice)
        return data;
    })
}

posServices.saleDeliveryNotes = async (id) => {
    const {data} = await axios.get(`/pos/sale/${id}/delivery-notes`);
    return data;
}

posServices.saleDispatchReport = async (id) => {
    const {data} = await axios.get(`/pos/sale/${id}/dispatch-report`);
    return data;
}

posServices.saleInvoices = async (id) => {
    const {data} = await axios.get(`/pos/sale/${id}/invoices`);
    return data;
}

posServices.saleReceipts = async (id) => {
    const {data} = await axios.get(`/pos/sale/${id}/receipts`);
    return data;
}

posServices.receiptDetails = async (id) => {
    const {data} = await axios.get(`/accounts/receipts/${id}`);
    return data;
}

posServices.deleteDeliveryNote = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/pos/delivery-note/${id}`);
        return data;
    })
};

posServices.deleteInvoice = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`/accounts/customer-invoices/${id}`);
        return data;
    })
};

posServices.deleteReceipt = async (id) => {
    return await axios.get('/sanctum/csrf-cookie').then(async (response) => {
        const {data} = await axios.delete(`accounts/receipts/${id}`);
        return data;
    })
};

posServices.deliveryNoteDetails = async (id) => {
    const {data} = await axios.get(`/pos/delivery-note/${id}`);
    return data;
}

posServices.invoiceDetails = async (id) => {
    const {data} = await axios.get(`/accounts/customer-invoices/${id}`);
    return data;
}

posServices.getAddresses = async () => {
    const { data } = await axios.get(`/pos/delivery-addresses`);
    return data;
}

posServices.getTermsandInstructions = async () => {
    const { data } = await axios.get(`/terms-and-instructions`);
    return data;
}

posServices.getSalesPerson = async () => {
    const { data } = await axios.get(`/pos/sales-people`);
    return data;
}

export default posServices;