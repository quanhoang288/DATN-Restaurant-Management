import pick from '../pick'
export const convertToOrderDTO = (stateData) => ({
  // customer_id: stateData.customerId ?? null,
  // customer_name: stateData.customerName ?? null,
  // customer_phone_number: stateData.phoneNumber ?? null,
  details: stateData.details.map((item) => pick(item, ['good_id', 'quantity'])),
  table: stateData.table?.id,
  note: stateData.note,
  // status: stateData.status,
  discounts: stateData.discounts,
  type: stateData.type,
})

export const fromDTOToStateData = (dto) => ({
  type: dto.type,
  table: dto.reservationTable?.table_id,
  // phoneNumber: dto.customer_phone_number,
  note: dto.note,
  details: dto.goods.map((good) => ({
    id: good.OrderDetail?.id,
    good_id: good.id,
    name: good.name,
    quantity: good.OrderDetail?.quantity,
    finished_quantiy: good.OrderDetail?.finished_quantiy,
    price: good.sale_price,
    status: good.OrderDetail?.status,
  })),
  discounts: (dto.orderDiscounts || []).map((orderDiscount) => {
    const constraint = orderDiscount.discountConstraint
    const discount = constraint.discount
    return {
      ...discount,
      constraint,
      discountItems: orderDiscount.discountItems,
    }
  }),
  status: dto.status,
})

