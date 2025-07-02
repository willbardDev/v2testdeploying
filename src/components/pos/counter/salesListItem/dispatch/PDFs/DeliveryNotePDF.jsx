import { Document, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import pdfStyles from 'app/prosServices/prosERP/pdf/pdf-styles';
import PdfLogo from 'app/prosServices/prosERP/pdf/PdfLogo';
import PageFooter from 'app/prosServices/prosERP/pdf/PageFooter';
import DocumentStakeholders from 'app/prosServices/prosERP/pdf/DocumentStakeholders';

function DeliveryNotePDF({delivery,organization,thermalPrinter}) {
    const mainColor = organization.settings?.main_color || "#2113AD";
    const lightColor = organization.settings?.light_color || "#bec5da";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";

    const PDF80mm = () => (

        <Page size={[80 * 2.83465, 297 * 2.83465]} style={{...pdfStyles.page, padding: 10, scale: 0.7 }}>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 10, justifyContent: 'center' }}>
                <View style={{ flex: 1, padding: 1 , maxWidth: (organization?.logo_path ? 130 : 250)}}>
                    <PdfLogo organization={organization} />
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 10 , textAlign: 'center' }}>
                <View style={{ flex: 1, padding: 1 }}>
                    <Text style={{...pdfStyles.majorInfo, color: mainColor }}>DELIVERY NOTE</Text>
                    <Text style={{ ...pdfStyles.midInfo }}>{delivery.deliveryNo}</Text>
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Dispatch Date:</Text>
                    <Text style={{...pdfStyles.minInfo }}>{readableDate(delivery.dispatch_date)}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Dispatched By:</Text>
                    <Text style={{...pdfStyles.minInfo }}>{delivery.creator.name}</Text>
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow, marginBottom:5}}>
                <View style={{flex: 1, padding: 2}}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Dispatch From:</Text>
                    <Text style={{...pdfStyles.minInfo }}>{delivery.dispatch_from}</Text>
                </View>
                <View style={{flex: 1, padding: 2}}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Destination:</Text>
                    <Text style={{...pdfStyles.minInfo }}>{delivery.destination}</Text>
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 10 }}>
                <View style={{ flex: 1, padding: 1 }}>
                    <Text 
                        style={{
                            ...pdfStyles.tableCell, 
                            backgroundColor: mainColor, 
                            color: contrastText,
                            textAlign: 'center'
                        }}
                    >
                    {'FROM'}
                    </Text>
                    <Text style={{...pdfStyles.midInfo, textAlign: 'center'}}>{organization.name}</Text>
                    {organization?.address && <Text style={{...pdfStyles.minInfo, textAlign: 'center'}}>{organization.address}</Text>}
                    {organization?.tin && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>TIN:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{organization.tin}</Text>
                        </View>
                    }
                    {organization?.settings?.vrn && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>VRN:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{organization.settings.vrn}</Text>
                        </View>
                    }
                    {organization?.phone && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>Phone:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{organization.phone}</Text>
                        </View>
                    }
                    {organization?.email && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>Email:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{organization.email}</Text>
                        </View>
                    }
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 10 }}>
                <View style={{ flex: 1, padding: 1 }}>
                    <Text 
                        style={{
                            ...pdfStyles.tableCell, 
                            backgroundColor: mainColor, 
                            color: contrastText,
                            textAlign: 'center'
                        }}
                    >
                    {'TO'}
                    </Text>
                    <Text style={{...pdfStyles.midInfo, fontWeight: 'bold', textAlign: 'center'}}>{delivery.sale.stakeholder.name}</Text>
                    {delivery.sale.stakeholder?.address && <Text style={{...pdfStyles.minInfo, textAlign: 'center'}}>{delivery.sale.stakeholder.address}</Text>}
                    {delivery.sale.stakeholder?.tin && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>TIN:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{delivery.sale.stakeholder.tin}</Text>
                        </View>
                    }
                    {delivery.sale.stakeholder?.vrn && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>VRN:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{delivery.sale.stakeholder.vrn}</Text>
                        </View>
                    }
                    {delivery.sale.stakeholder?.phone && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>Phone:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{delivery.sale.stakeholder.phone}</Text>
                        </View>
                    }
                    {delivery.sale.stakeholder?.email && 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{...pdfStyles.minInfo}}>Email:</Text>
                            <Text style={{...pdfStyles.minInfo}}>{delivery.sale.stakeholder.email}</Text>
                        </View>
                    }
                </View>
            </View>
            <View style={{...pdfStyles.table}}>
                <View style={pdfStyles.tableRow}>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 0.5 }}>S/N</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 3.5 }}>Product</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 0.5 }}>Unit</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 1 }}>Qty</Text>
                </View>
                {
                    delivery.items.map((deliveryItem,index) => (
                        <View key={index} style={{ ...pdfStyles.tableRow,borderTop: '1px', borderTopStyle: 'solid', borderTopColor: mainColor }}>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.5}}>{index+1}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 3.5}}>{deliveryItem.product.name}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.5}}>{deliveryItem.sale_item.measurement_unit?.symbol}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 1,textAlign : 'right'  }}>{deliveryItem.quantity}</Text>
                        </View>
                    ))
                }
            </View>
            {
                (delivery?.driver_information || delivery.vehicle_information) &&
                <View style={{ ...pdfStyles.tableRow, marginTop:20, marginBottom:10, borderBottom: '1px solid black'}}>
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
                </View>
           }
           {
                delivery.remarks &&
                <View style={{ ...pdfStyles.tableRow, marginTop:20, marginBottom:10, borderBottom: '1px solid black'}}>
                    {delivery.remarks && 
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Remarks</Text>
                            <Text style={{...pdfStyles.minInfo }}>{delivery.remarks}</Text>
                        </View>
                    }
                </View>
           }
                <View style={{ ...pdfStyles.tableRow, marginTop:10,}}>
                    <View style={{flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo}}>Received the above mentioned goods in good order and condition</Text>
                    </View>
                </View>
                <View style={{ ...pdfStyles.tableRow, marginTop:10}}>
                    <View style={{flex: 3, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, textDecoration: 'underline'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>{`Name`}</Text>
                    </View>
                </View>
                <View style={{ ...pdfStyles.tableRow, marginTop:10,}}>
                    <View style={{flex: 1.5, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, textDecoration: 'underline'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>{`Signature`}</Text>
                    </View>
                    <View style={{flex: 1.5, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, textDecoration: 'underline'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>{`Date`}</Text>
                    </View>
                </View>
                <View style={{ ...pdfStyles.tableRow, marginTop: 50, textAlign: 'center'}}>
                    <View style={{ flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo }}>Powered by: proserp.co.tz</Text>
                    </View>
                </View>
        </Page>
    );

    const PDFA4 = () => (
        <Page size="A4" style={pdfStyles.page}>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 20 }}>
                <View style={{ flex: 1, maxWidth: (organization?.logo_path ? 130 : 250)}}>
                    <PdfLogo organization={organization} />
                </View>
                <View style={{ flex: 1, textAlign: 'right' }}>
                    <Text style={{...pdfStyles.majorInfo, color: mainColor }}>DELIVERY NOTE</Text>
                    <Text style={{ ...pdfStyles.midInfo }}>{delivery.deliveryNo}</Text>
                </View>
            </View>
            <DocumentStakeholders organization={organization} stakeholder={delivery.sale.stakeholder} fromLabel='FROM' toLabel='TO' />
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
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Dispatch From</Text>
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
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 3 }}>Product</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 0.5 }}>Unit</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 1 }}>Quantity</Text>
                </View>
                {
                    delivery.items.map((deliveryItem,index) => (
                        <View key={index} style={pdfStyles.tableRow}>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.3}}>{index+1}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 3}}>{deliveryItem.product.name}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.5}}>{deliveryItem.sale_item.measurement_unit?.symbol}</Text>
                            <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 1,textAlign : 'right'  }}>{deliveryItem.quantity}</Text>
                        </View>
                    ))
                }
            </View>
            {
                (delivery?.driver_information || delivery.vehicle_information || delivery.remarks) &&
                <View style={{ ...pdfStyles.tableRow, marginBottom:10, borderBottom: '1px solid black'}}>
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
                }
                <View style={{ ...pdfStyles.tableRow, marginTop:30,}}>
                    <View style={{flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo}}>Received the above mentioned goods in good order and condition</Text>
                    </View>
                </View>
            <View style={{ ...pdfStyles.tableRow, marginTop:30,}}>
                    <View style={{flex: 3, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, textDecoration: 'underline'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>{`Name`}</Text>
                    </View>
                    <View style={{flex: 1.5, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, textDecoration: 'underline'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>{`Signature`}</Text>
                    </View>
                    <View style={{flex: 1.5, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, textDecoration: 'underline'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>{`Date`}</Text>
                    </View>
            </View>
            <PageFooter/>
        </Page> 
    )

  return (
    <Document 
        title={`${delivery.deliveryNo}`}
        author={`${delivery.creator.name}`}
        subject='Delivery Note'
        creator='ProsERP'
        producer='ProsERP'
    >
        { !!thermalPrinter ? <PDF80mm/> : <PDFA4/> }
    </Document>             
  )
}

export default DeliveryNotePDF