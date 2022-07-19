import React from 'react'
import { Page, Document, StyleSheet, View, Text, Image } from '@react-pdf/renderer'
import InvoiceItemsTable from './InvoiceItemsTable'

const styles = StyleSheet.create({
  page: {
    fontSize: 14,
    paddingTop: 30,
    paddingHorizontal: 60,
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  restaurantInfo: {
    marginTop: 5,
  },
  invoiceInfo: {
    marginTop: 10,
  },
})

function InvoiceHeader(props) {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          src='https://media.istockphoto.com/vectors/restaurant-food-drinks-logo-fork-knife-background-vector-image-vector-id981368726?k=20&m=981368726&s=612x612&w=0&h=Um4YOExWlUgOfpUs2spnN0NrrXs-M71OUuUMbStVFNQ='
        />
        <Text>My kitchen</Text>
      </View>
      <View style={styles.restaurantInfo}>
        <Text>Nha hang ABC</Text>
        <Text>D/C: ABC, DEF, XYZ</Text>
        <Text>Tel: 0382203949 - 0903940393</Text>
      </View>
    </View>
  )
}

export default function Invoice(props) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <InvoiceHeader />
        <View style={styles.invoiceInfo}>
          <Text>TN: Hoang Huy Quan</Text>
          <Text>Ban: A12</Text>
          <Text>Ngay: 27/06/2022</Text>
        </View>
        <InvoiceItemsTable />
      </Page>
    </Document>
  )
}

