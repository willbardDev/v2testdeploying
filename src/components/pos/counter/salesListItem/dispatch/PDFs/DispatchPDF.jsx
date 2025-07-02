import { Document, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import pdfStyles from 'app/prosServices/prosERP/pdf/pdf-styles';
import PdfLogo from 'app/prosServices/prosERP/pdf/PdfLogo';
import PageFooter from 'app/prosServices/prosERP/pdf/PageFooter';

function DispatchPDF({delivery,organization}) {
    const mainColor = organization.settings?.main_color || "#2113AD";
    const lightColor = organization.settings?.light_color || "#bec5da";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";

    
  return (
    <Document 
        title={`${delivery.deliveryNo}`}
        author={`${delivery.creator.name}`}
        subject='Sales Dispatch'
        creator='ProsERP'
        producer='ProsERP'
    >
            <Page size="A4" style={pdfStyles.page}>
                <View style={{ ...pdfStyles.tableRow, marginBottom: 20 }}>
                    <View style={{ flex: 1, maxWidth: (organization?.logo_path ? 130 : 250)}}>
                        <PdfLogo organization={organization} />
                    </View>
                    <View style={{ flex: 1, textAlign: 'right' }}>
                        <Text style={{...pdfStyles.majorInfo, color: mainColor }}>Sale Dispatch</Text>
                        <Text style={{ ...pdfStyles.midInfo }}>{delivery.deliveryNo}</Text>
                    </View>
                </View>
                <View style={{ ...pdfStyles.tableRow, marginBottom:10}}>
                    <View style={{ flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>Dispatch Date</Text>
                        <Text style={{...pdfStyles.minInfo }}>{readableDate(delivery.dispatch_date)}</Text>
                    </View>
                    <View style={{flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>Dispatched By</Text>
                        <Text style={{...pdfStyles.minInfo }}>{delivery.creator.name}</Text>
                    </View>
                    <View style={{flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>From</Text>
                        <Text style={{...pdfStyles.minInfo }}>{delivery.dispatch_from}</Text>
                    </View>
                    <View style={{flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>Destination</Text>
                        <Text style={{...pdfStyles.minInfo }}>{delivery.destination}</Text>
                    </View>
                </View>
                <View style={{...pdfStyles.table, minHeight: 150 }}>
                    <View style={pdfStyles.tableRow}>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 0.3 }}>S/N</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 4 }}>Product</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 0.5 }}>Unit</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 1 }}>Quantity</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 1.5 }}>Store</Text>
                    </View>
                    {
                        delivery.items.map((deliveryItem,index) => (
                            <View key={index} style={pdfStyles.tableRow}>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.3}}>{index+1}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 4}}>{deliveryItem.product.name}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.5}}>{deliveryItem.sale_item.measurement_unit?.symbol}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 1,textAlign : 'right'  }}>{deliveryItem.quantity}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 1.5}}>{deliveryItem.store.name}</Text>
                            </View>
                        ))
                    }
                </View>
                <View style={{ ...pdfStyles.tableRow, marginBottom:10}}>
                   {delivery.vehicle_information &&
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Vehicle Information</Text>
                            <Text style={{...pdfStyles.minInfo }}>{delivery.vehicle_information}</Text>
                        </View>
                    }
                   {delivery.driver_information &&
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Driver Information</Text>
                            <Text style={{...pdfStyles.minInfo }}>{delivery.driver_information}</Text>
                        </View>
                    }
                    {delivery.remarks && 
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Remarks</Text>
                            <Text style={{...pdfStyles.minInfo }}>{delivery.remarks}</Text>
                        </View>
                    }
                </View>
                <PageFooter/>
            </Page> 
    </Document>             
  )
}

export default DispatchPDF