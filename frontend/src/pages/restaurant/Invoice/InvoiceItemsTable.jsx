import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  tableRow: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 60,
  },
  tableHeader: {
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 1,
    flexGrow: 1,
  },
});

function InvoiceTableRow({ item, index }) {
  return (
    <View style={styles.tableRow}>
      <Text style={{ width: 50 }}>{index + 1}</Text>
      <Text style={{ width: 200 }}>{item.name}</Text>
      <Text style={{ width: 100 }}>{item.quantity}</Text>
      <Text style={{ width: 100 }}>{item.sale_price}</Text>
      <Text style={{ width: 100, textAlign: "right" }}>
        {item.sale_price * item.quantity}
      </Text>
    </View>
  );
}

const InvoiceItemsTable = ({ items }) => (
  <View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <Text style={{ width: 50 }}>STT</Text>
      <Text style={{ width: 200 }}>Tên món</Text>
      <Text style={{ width: 100 }}>SL</Text>
      <Text style={{ width: 100 }}>Đơn giá</Text>
      <Text style={{ width: 100, textAlign: "right" }}>Thành tiền</Text>
    </View>
    <View style={{ borderBottomWidth: 1 }}>
      {(items || []).map((item, idx) => (
        <InvoiceTableRow item={item} index={idx} />
      ))}
    </View>
  </View>
);

export default InvoiceItemsTable;
