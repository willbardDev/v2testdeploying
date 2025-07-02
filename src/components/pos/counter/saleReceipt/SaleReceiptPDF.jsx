import { Document, Image, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import pdfStyles from '../../../pdf/pdf-styles'
import PdfLogo from '../../../pdf/PdfLogo';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import QRCode from 'qrcode' 

function SaleReceiptPDF({user, organization, sale}) {
    const vat_factor = sale.vat_percentage*0.01;

    //Total For only Items require VAT Inclusive
    const totalAmountForVAT = sale.sale_items.filter(item => item.vat_exempted !== 1).reduce((total, item) => {
        return total += item.rate * item.quantity;
    }, 0);

    const vatAmount = totalAmountForVAT*sale.vat_percentage/100 //Total VAT 

    // Function that generates a data URL for a QR code so that will be used as the source for an image element to display the QR code
    const generateQRCodeDataUrl = () => {
        const dataUrl = QRCode.toDataURL(sale.vfd_receipt.verification_url);
        return dataUrl;
    }; 

  return (
    <Document 
        creator={` ${user.name} | Powered By ProsERP` }
        producer='ProsERP'
    >
        <Page size={[80 * 2.83465, 297 * 2.83465]}  style={{...pdfStyles.page, padding: 10, scale: 0.7 }}>

            {/* Start*/}
           {sale.vfd_receipt &&    
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center', marginBottom: 10}}>
                    <View style={{ flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>*** START OF LEGAL RECEIPT ***</Text>
                    </View>
                </View>
            }

            {/* Organization Logo*/}
            <View style={{ ...pdfStyles.tableRow, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ flex: 1, padding: 1, maxWidth: (organization?.logo_path ? 130 : 250)}}>
                    {!!organization?.logo_path && <PdfLogo organization={organization} />}
                </View>
            </View>

            {/* Organization Informations*/}
            <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                <View style={{ flex: 1}}> 
                   <Text style={{...pdfStyles.midInfo, fontFamily: 'Helvetica-Bold'}}>{organization.name}</Text>
                </View>
            </View>
            {organization.address &&
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>    
                    <View style={{flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, textAlign: 'center'}}>{organization.address}</Text>
                    </View>
                </View>
            }
            {organization.tin &&
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold', textAlign: 'right'}}>TIN:</Text>
                    </View>
                    <View style={{flex: 1.8}}>
                        <Text style={{...pdfStyles.minInfo, textAlign: 'left'}}>{organization.tin}</Text>
                    </View>
                </View>
            }
            {organization.vrn &&
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                    <View style={{flex: 0.5}}>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold', textAlign: 'right'}}>VRN:</Text>
                    </View>
                    <View style={{flex: 1.8}}>
                        <Text style={{...pdfStyles.minInfo, textAlign: 'left'}}>{organization.settings.vrn}</Text>
                    </View>
                </View>
            }
            {organization.phone &&
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{flex: 1}}>
                       <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold', textAlign: 'right'}}>Phone:</Text>
                    </View>
                    <View style={{flex: 1.8}}>
                        <Text style={{...pdfStyles.minInfo, textAlign: 'left'}}>{organization.phone}</Text>
                    </View>
                </View>
            }
            {organization.tra_serial_number &&
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                    <View style={{flex: 0.6}}>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold', textAlign: 'right'}}>Serial Number:</Text>
                    </View>
                    <View style={{flex: 1.5}}>
                       <Text style={{...pdfStyles.minInfo, textAlign: 'left'}}>{organization.tra_serial_number}</Text>
                    </View>
                </View>
            }
            {organization.email &&
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                    <View style={{flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, textAlign: 'center'}}>{organization.email}</Text>
                    </View>
                </View>
            }
            <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                <View style={{ flex: 1}}> 
                    <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>{sale.sales_outlet.name}</Text>
                </View>
            </View>

            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{...pdfStyles.blackLine,flex:1}}>
                </View>
            </View>

            {/* Receipt Informations */}
            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Receipt No.</Text>
                </View>
                <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                </View>
                <View style={{ flex: 1, textAlign: 'right'}}>
                    <Text style={{...pdfStyles.minInfo}}>{sale.saleNo}</Text>
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{ flex: 1}}>
                   <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Date</Text>
                </View>
                <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                </View>
                <View style={{ flex: 1, textAlign: 'right'}}>
                    <Text style={{...pdfStyles.minInfo}}>{readableDate(sale?.vfd_receipt ? sale.vfd_receipt.created_at : sale.transaction_date)}</Text>
                </View>
            </View>
            {sale?.vfd_receipt &&
                <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Time</Text>
                    </View>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{ flex: 1, textAlign: 'right'}}>
                        <Text style={{...pdfStyles.minInfo}}>{sale.vfd_receipt.receipt_time}</Text>
                    </View>
                </View>
            }
            { sale.reference &&
                <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{ flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Reference</Text>
                    </View>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{ flex: 1, textAlign: 'right'}}>
                        <Text style={{...pdfStyles.minInfo}}>{sale.reference}</Text>
                    </View>
                </View>
            }

            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{...pdfStyles.blackLine,flex:1}}>
                </View>
            </View>

            {/* Customer Informations */}
            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Customer Name</Text>
                </View>
                <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                </View>
                <View style={{ flex: 1, textAlign: 'right'}}>
                    <Text style={{...pdfStyles.minInfo}}>{sale?.vfd_receipt?.customer_name ? sale.vfd_receipt.customer_name : sale.stakeholder.name}</Text>
                </View>
            </View>
            {(sale?.vfd_receipt?.customer_tin || sale.stakeholder?.tin) &&
                <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{ flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Customer TIN</Text>
                    </View>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{ flex: 1, textAlign: 'right'}}>
                        <Text style={{...pdfStyles.minInfo}}>{sale?.vfd_receipt?.customer_tin ? sale.vfd_receipt.customer_tin : sale.stakeholder.tin}</Text>
                    </View>
                </View>
            }
            {(sale?.vfd_receipt?.customer_vrn || sale.stakeholder?.vrn) &&
                <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Customer VRN</Text>
                    </View>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{ flex: 1, textAlign: 'right'}}>
                    <Text style={{...pdfStyles.minInfo}}>{sale?.vfd_receipt?.customer_vrn ? sale.vfd_receipt.customer_vrn : sale.stakeholder.vrn}</Text>
                    </View>
                </View>
            }
            {sale.stakeholder?.email &&
                <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Email</Text>
                    </View>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{ flex: 1, textAlign: 'right'}}>
                    <Text style={{...pdfStyles.minInfo}}>{sale.stakeholder.email}</Text>
                    </View>
                </View>
            }
            {sale.stakeholder?.phone &&
                <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Phone</Text>
                    </View>
                    <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                    </View>
                    <View style={{ flex: 1, textAlign: 'right'}}>
                    <Text style={{...pdfStyles.minInfo}}>{sale.stakeholder.phone}</Text>
                    </View>
                </View>
            }

            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{...pdfStyles.blackLine,flex:1}}>
                </View>
            </View>

            {/* Receipt Sale Items */}
            {
                sale.sale_items.map((item,index) => (
                <React.Fragment key={index}>
                    <View style={{ ...pdfStyles.tableRow}}>
                        <View style={{ flex: 1}}>
                            <Text style={{...pdfStyles.minInfo}}>{item.product.name}</Text>
                        </View>
                    </View>
                    <View style={{ ...pdfStyles.tableRow}}>
                        <View style={{flex: 1}}>
                            <View style={{ ...pdfStyles.tableRow}}>
                                <View style={{...pdfStyles.minInfo,flex: 3}}>
                                    <Text style={{...pdfStyles.minInfo}}>{`${item.quantity} ${item.measurement_unit.symbol} X ${(item.rate*(1+(item?.vat_exempted !== 1 ? vat_factor : 0))).toLocaleString()}`}</Text>
                                </View>
                                <View style={{ flex: 1, textAlign: 'right'}}>
                                    <Text style={{...pdfStyles.minInfo}}>{(item.quantity*item.rate*(1+(item?.vat_exempted !== 1 ? vat_factor : 0))).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ ...pdfStyles.tableRow}}>
                        <View style={{...pdfStyles.blackLine,flex:1}}>
                        </View>
                    </View>
                </React.Fragment>
                ))
            }
               
            {/* Total Amount and VAT amount */}
            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{ flex: 1}}>
                   <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>TOTAL</Text>
                </View>
                <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                </View>
                <View style={{ flex: 1, textAlign: 'right'}}>
                   <Text style={{...pdfStyles.minInfo}}>{sale.amount.toLocaleString("en-US", {style:"currency", currency:sale.currency.code})}</Text>
                </View>
            </View>
            { sale.vat_percentage > 0 && 
                <>
                    <View style={{ ...pdfStyles.tableRow}}>
                        <View style={{ flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>VAT</Text>
                        </View>
                        <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                        </View>
                        <View style={{ flex: 1, textAlign: 'right'}}>
                        <Text style={{...pdfStyles.minInfo}}>{vatAmount.toLocaleString("en-US", {style:"currency", currency:sale.currency.code})}</Text>
                        </View>
                    </View>
                    <View style={{ ...pdfStyles.tableRow}}>
                        <View style={{ flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Total (VAT Incl.)</Text>
                        </View>
                        <View style={{...pdfStyles.minInfo,flex: 0.5}}>
                        </View>
                        <View style={{ flex: 1, textAlign: 'right'}}>
                        <Text style={{...pdfStyles.minInfo}}>{(sale.amount + vatAmount).toLocaleString("en-US", {style:"currency", currency:sale.currency.code})}</Text>
                        </View>
                    </View>
                </>
            }

            <View style={{ ...pdfStyles.tableRow, marginBottom: 10}}>
                <View style={{...pdfStyles.blackLine,flex:1}}>
                </View>
            </View>

            {/* verification code */}
            { sale.vfd_receipt && 
                <>
                    <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                        <View style={{ flex: 1}}>
                            <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>Receipt Verification Code</Text>
                        </View>
                    </View>
                    <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                        <View style={{ flex: 1}}>
                            <Text style={{...pdfStyles.minInfo}}>{sale.vfd_receipt.verification_code}</Text>
                        </View>
                    </View>
                    <View style={{ ...pdfStyles.tableRow, justifyContent: 'center', marginBottom: 10}}>
                        <View>
                            <Image src={generateQRCodeDataUrl} style={{ width: 100, height: 100 }}/>
                        </View>
                    </View>
                </>
            }

            {/* Creator Information*/}
            <View style={{ ...pdfStyles.tableRow, textAlign: 'center', marginBottom: 10}}>
                <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.minInfo}}>Served by: {sale.creator.name}</Text>
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow, textAlign: 'center', marginBottom: 15}}>
                <View style={{ flex: 1}}>
                    <Text style={{...pdfStyles.microInfo}}>Powered by: proserp.co.tz </Text>
                </View>
            </View>

            {/* The End*/}
            {sale.vfd_receipt &&
                <View style={{ ...pdfStyles.tableRow, textAlign: 'center'}}>
                    <View style={{ flex: 1}}>
                        <Text style={{...pdfStyles.minInfo, fontFamily: 'Helvetica-Bold'}}>*** END OF LEGAL RECEIPT ***</Text>
                    </View>
                </View>
            }
        </Page>
    </Document>
  )
}

export default SaleReceiptPDF