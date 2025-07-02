import { Document, Image, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import pdfStyles from 'app/prosServices/prosERP/pdf/pdf-styles';
import PdfLogo from 'app/prosServices/prosERP/pdf/PdfLogo';
import PageFooter from 'app/prosServices/prosERP/pdf/PageFooter';
import DocumentStakeholders from 'app/prosServices/prosERP/pdf/DocumentStakeholders';
import QRCode from 'qrcode';

function InvoicePDF({invoice,organization}) {
    const currencyCode = invoice.currency.code;
    const mainColor = organization.settings?.main_color || "#2113AD";
    const lightColor = organization.settings?.light_color || "#bec5da";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";

    //Total For only Items require VAT Inclusive
    const totalAmountForVAT = invoice.items.filter(item => item.vat_exempted !== 1).reduce((total, item) => {
        return total += item.vat_amount;
    }, 0);

    // Function that generates a data URL for a QR code so that will be used as the source for an image element to display the QR code
    const generateQRCodeDataUrl = () => {
        const dataUrl = QRCode.toDataURL(invoice.vfd_receipt.verification_url);
        return dataUrl;
    }; 

  return (
    <Document 
        title={`${invoice.invoiceNo}`}
        author={`${invoice.creator.name}`}
        subject='Invoice Note'
        creator='ProsERP'
        producer='ProsERP'
    >
            <Page size="A4" style={pdfStyles.page}>
                <View style={{ ...pdfStyles.tableRow, marginBottom: 10 }}>
                    <View style={{ flex: 1, maxWidth: (organization?.logo_path ? 130 : 250)}}>
                        <PdfLogo organization={organization} />
                    </View>
                    <View style={{ flex: 1, textAlign: 'right' }}>
                        <Text style={{...pdfStyles.majorInfo, color: mainColor }}>{invoice.vfd_receipt ? `TAX INVOICE` : `INVOICE`}</Text>
                        <Text style={{ ...pdfStyles.midInfo }}>{invoice.invoiceNo}</Text>
                        {/* verification code */}
                        { invoice.vfd_receipt && 
                            <>
                                <View style={{ ...pdfStyles.tableRow, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
                                    <View>
                                        <View style={{ ...pdfStyles.tableRow}}>
                                            <Text style={{ ...pdfStyles.microInfo}}>{invoice.vfd_receipt.verification_code}</Text>
                                        </View>
                                        <View style={{ ...pdfStyles.tableRow}}>
                                            <Text style={{ ...pdfStyles.microInfo}}>{readableDate(invoice.vfd_receipt.receipt_date)}</Text>
                                        </View>
                                        <View style={{ ...pdfStyles.tableRow}}>
                                            <Text style={{ ...pdfStyles.microInfo}}>{invoice.vfd_receipt.receipt_time}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Image src={generateQRCodeDataUrl} style={{ width: 50, height: 50 }}/>
                                    </View>
                                </View>
                                <View style={{ ...pdfStyles.tableRow, textAlign: 'right'}}>
                                    <View style={{ flex: 1}}>
                                        <Text style={{...pdfStyles.microInfo}}>{invoice.vfd_receipt.verification_url}</Text>
                                    </View>
                                </View>
                            </>
                        }
                    </View>
                </View>
                <DocumentStakeholders stakeholder={invoice.stakeholder} organization={organization}/>
                <View style={{ ...pdfStyles.tableRow, marginBottom:8}}>
                    <View style={{ flex: 1, padding: 2}}>
                        <Text style={{...pdfStyles.minInfo, color: mainColor }}>Invoice Date</Text>
                        <Text style={{...pdfStyles.minInfo }}>{readableDate(invoice.transaction_date)}</Text>
                    </View>
                    { invoice.due_date &&
                        <View style={{ flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Due Date</Text>
                            <Text style={{...pdfStyles.minInfo }}>{readableDate(invoice.due_date)}</Text>
                        </View>
                    }
                    {invoice.internal_reference &&
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Internal Reference</Text>
                            <Text style={{...pdfStyles.minInfo }}>{invoice.internal_reference}</Text>
                        </View>
                    }
                    {invoice.customer_reference &&
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Customer Reference</Text>
                            <Text style={{...pdfStyles.minInfo }}>{invoice.customer_reference}</Text>
                        </View>
                    }
                </View>
                <View style={{...pdfStyles.table, minHeight: 130 }}>
                    <View style={pdfStyles.tableRow}>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 0.3 }}>S/N</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 3 }}>Product</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 0.5 }}>Unit</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 1 }}>Quantity</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 1 }}>Unit Price</Text>
                        <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 1 }}>Amount</Text>
                    </View>
                    {
                        invoice.items.map((invoiceItem,index) => (
                            <View key={index} style={pdfStyles.tableRow}>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.3}}>{index+1}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 3}}>{invoiceItem.product}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 0.5}}>{invoiceItem?.measurement_unit?.symbol || invoiceItem?.measurement_unit}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 1,textAlign : 'right'  }}>{invoiceItem.quantity}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 1,textAlign : 'right'  }}>{invoiceItem.rate.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex : 1,textAlign : 'right'  }}>{(invoiceItem.quantity * invoiceItem.rate).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</Text>
                            </View>
                        ))
                    }
                </View>
                <View style={{ ...pdfStyles.tableRow, marginTop: 4 }}>
                    <Text style={{ textAlign: 'center', flex : 4.3  }}></Text>
                        <Text style={{...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex : 2.2, textAlign : 'right'}}>Total</Text>
                    <Text style={{...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex : 2, textAlign : 'right'}}>{invoice.amount.toLocaleString("en-US", {style:"currency", currency:currencyCode})}</Text>
                </View>
                {  totalAmountForVAT > 0 && 
                    <>
                        <View style={{ ...pdfStyles.tableRow, marginTop: 1}}>
                            <Text style={{ textAlign: 'center', flex : 4.3  }}></Text>
                                <Text style={{...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,  flex : 2.2, textAlign : 'right'}}>VAT</Text>
                            <Text style={{...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex : 2, textAlign : 'right'}}>{ totalAmountForVAT.toLocaleString("en-US", {style:"currency", currency:currencyCode})}</Text>
                        </View>
                        <View style={{ ...pdfStyles.tableRow, marginTop: 1, marginBottom:30}}>
                            <Text style={{ textAlign: 'center', flex : 4.3  }}></Text>
                                <Text style={{...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex : 2.2, textAlign : 'right'}}>Grand Total (VAT Incl.)</Text>
                            <Text style={{...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex : 2, textAlign : 'right'}}>{(invoice.amount + totalAmountForVAT).toLocaleString("en-US", {style:"currency", currency:currencyCode})}</Text>
                        </View>
                    </>
                }
                <View style={{ ...pdfStyles.tableRow, marginTop: 5}}>
                    {invoice.narration && 
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Narration</Text>
                            <Text style={{...pdfStyles.minInfo }}>{invoice.narration}</Text>
                        </View>
                    }
                    {!!invoice?.terms_and_instructions && 
                        <View style={{flex: 1, padding: 2}}>
                            <Text style={{...pdfStyles.minInfo, color: mainColor }}>Terms And Instructions</Text>
                            <Text style={{...pdfStyles.minInfo }}>{invoice.terms_and_instructions}</Text>
                        </View>
                    }
                </View>
                
                <PageFooter/>
            </Page> 
    </Document>             
  )
}

export default InvoicePDF