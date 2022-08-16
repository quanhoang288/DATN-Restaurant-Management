import pick from "../pick";
export const convertToOrderDTO = (stateData) => ({
  branch_id: stateData.branchId,
  customer_id: stateData.customerId,
  customer_name: stateData.customerName,
  customer_phone_number: stateData.customerPhoneNumber,
  shipper_id: stateData.shipperId,
  delivery_info_id: stateData.delivery_info_id,
  delivery_address: stateData.deliveryAddress,
  details: stateData.details.map((item) => pick(item, ["id", "quantity"])),
  table: stateData.table,
  note: stateData.note,
  status: stateData.status,
  discounts: stateData.discounts,
  payment_status: stateData.payment_status,
  type: stateData.type,
});

export const fromDTOToStateData = (dto) => ({
  ...dto,
  branchId: dto.branch_id,
  shipperId: dto.shipper_id,
  table: dto.reservationTable?.table_id,
  tableName: dto.reservationTable?.table?.name,
  customerPhoneNumber: dto.customer
    ? dto.customer.user.phone_number
    : dto.customer_phone_number,
  customerName: dto.customer ? dto.customer.user.full_name : dto.customer_name,
  customerId: dto.customer_id,
  deliveryAddress: dto.deliveryInfo
    ? dto.deliveryInfo.delivery_address
    : dto.delivery_address,
  createdByCustomer: dto.created_by_customer,
  details: dto.goods.map((good) => ({
    id: good.id,
    name: good.name,
    quantity: good.OrderDetail?.quantity,
    finished_quantity: good.OrderDetail?.finished_quantity,
    sale_price: good.sale_price,
    status: good.OrderDetail?.status,
  })),
  discounts: (dto.orderDiscounts || []).map((orderDiscount) => {
    const constraint = orderDiscount.discountConstraint;
    const discount = constraint.discount;
    return {
      ...discount,
      constraint,
      discountItems: orderDiscount.discountItems,
    };
  }),
});
