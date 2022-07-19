export const convertToReservationDTO = (stateData) => ({
  arrive_time: stateData.arriveTime,
  // customer_id: stateData.customerId,
  // customer_name: stateData.customerName,
  customer_phone_number: stateData.phoneNumber,
  num_people: stateData.numPeople,
  note: stateData.note,
  status: stateData.status,
  tables: (stateData.tables || []).map((table) => table.id),
})

export const fromDTOToStateData = (dto) => ({
  arriveTime: dto.arrive_time,
  customerId: dto.customer_id,
  customerName: dto.customer_name,
  phoneNumber: dto.customer_phone_number,
  note: dto.note,
  numPeople: dto.num_people,
  status: dto.status,
  tables: dto.tables || [],
})

