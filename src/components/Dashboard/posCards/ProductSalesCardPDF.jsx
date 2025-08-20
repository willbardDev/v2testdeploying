import { Text, View,Document,Page } from '@react-pdf/renderer'
import React from 'react'
import pdfStyles from '../../pdf/pdf-styles';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import PdfLogo from '../../pdf/PdfLogo';

function ProductSalesCardPDF({organization = null, popularProducts, topProductsData, selectedTop, salesPersonsSelected}) {
  const mainColor = organization.settings?.main_color || "#2113AD";
  const contrastText = organization.settings?.contrast_text || "#FFFFFF";
  const lightColor = organization.settings?.light_color || "#bec5da";
  const reportPeriod = `${readableDate(topProductsData.params.from,true)} - ${readableDate(topProductsData.params.to,true)}`;

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }  

  return (
    <Document 
        creator={` ${topProductsData.user} | Powered By ProsERP` }
        producer='ProsERP'
        title={`Top Products ${reportPeriod}`}
      >
        <Page size="A4" style={pdfStyles.page}>
          <View style={{ ...pdfStyles.table}}>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 25}}>
                <View style={{ flex: 1, maxWidth: 120}}>
                  <PdfLogo organization={organization}/>
                </View>
                <View style={{ flex: 1, textAlign: 'right' }}>
                  <Text style={{...pdfStyles.majorInfo, color: mainColor }}>{`TOP PRODUCTS`}</Text>
                  <Text style={{ ...pdfStyles.minInfo }}>{reportPeriod}</Text>
                </View>
            </View>
            <View style={{ ...pdfStyles.tableRow}}>
                <View style={{ flex: 1, padding: 1 }}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Ordered By</Text>
                    <Text style={{ ...pdfStyles.minInfo }}>{capitalizeFirstLetter(topProductsData.params.order_by)}{' '}{capitalizeFirstLetter(topProductsData.params.order_direction)}</Text>
                </View>
                <View style={{ flex: 1, padding: 1 }}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed By</Text>
                    <Text style={{...pdfStyles.minInfo }}>{topProductsData.user}</Text>
                </View>
                <View style={{ flex: 1, padding: 1}}>
                  <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed On</Text>
                  <Text style={{...pdfStyles.minInfo }}>{readableDate(undefined,true)}</Text>
                </View>
                {salesPersonsSelected?.length > 0 &&
                  <View style={{ flex: 1, padding: 0.5 }}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Sales Person</Text>
                    <Text style={{...pdfStyles.minInfo }}>{salesPersonsSelected.map((person) => person).join(',')}</Text>
                  </View>
                }
            </View>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 5}}>
                {
                  topProductsData?.costCenters &&
                  <View style={{ flex: 1, padding: 0.5 }}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Cost Centers</Text>
                    <Text style={{...pdfStyles.minInfo }}>{topProductsData.costCenters.map(cc => cc.name).join(',')}</Text>
                  </View>
                }
            </View>
          </View>
          <View style={{...pdfStyles.table, minHeight: 230 }}>
                <View style={pdfStyles.tableRow}>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 0.5 }}>S/N</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 4 }}>{selectedTop}</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 0.5 }}>Unit</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 1.5 }}>Quantity</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 2 }}>Revenue</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 2 }}>CoGS</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 2 }}>Profit</Text>
                    <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,   flex : 1.5 }}>Margin</Text>
                </View>
                {
                    popularProducts.map((product,index) => (
                        <View key={index} style={pdfStyles.tableRow}>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 0.5 }}>{index+1}</Text>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 4 }}>{product.name}</Text>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 0.5 }}>{product.unit_symbol}</Text>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 1.5, textAlign : 'right'  }}>{product.quantity.toLocaleString('en-US',{maximumFractionDigits:3})}</Text>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 2, textAlign : 'right', color: 'blue'}}>{product.revenue.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 2, textAlign : 'right', color: 'red'}}>{product.cogs.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 2, textAlign : 'right', color: 'green'}}>{product.profit.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                            <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor,  flex : 1.5, textAlign : 'right', color: 'green'}}>{product.margin.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})} %</Text>
                        </View>
                    ))
                }
            </View>
        </Page>
    </Document>
  )
}

export default ProductSalesCardPDF