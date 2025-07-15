import React, { useState } from 'react';
import ProductVendor from '../../../form/productVendor/ProductVendor';
import ProductVendorRow from '../../../form/productVendor/ProductVendorRow';

function Vendors({ setRequisition_product_items, product_item, index }) {
  const [vendors, setVendors] = useState(product_item?.vendors ? product_item.vendors.map(vendor => ({
    ...vendor,
    stakeholder_id: vendor.stakeholder_id ?  vendor.stakeholder_id : vendor.id
  })) : []);

  return (
    <>
        <ProductVendor isFromApproval={true} vendorIndex={index} setRequisition_product_items={setRequisition_product_items} product_item={product_item} vendors={vendors} setVendors={setVendors}/>
        
        {vendors.map((vendor,index) => (
          <ProductVendorRow key={index} index={index} vendor={vendor} vendors={vendors} setVendors={setVendors}/>
        ))}
    </>
  );
}

export default Vendors;
