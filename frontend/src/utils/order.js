const getInvoiceTotal = (order) => {
  return (order.details || []).reduce(
    (prevSum, item) => (prevSum += item.quantity * item.sale_price),
    0
  );
};

const getDiscountAmount = (invoiceTotal, discounts) => {
  return (discounts || []).reduce(
    (amount, discount) =>
      discount.method === "invoice-discount"
        ? discount.constraint?.discount_unit === "cash"
          ? amount + discount.constraint.discount_amount
          : amount + (discount.constraint.discount_amount * invoiceTotal) / 100
        : amount,
    0
  );
};

export { getInvoiceTotal, getDiscountAmount };
