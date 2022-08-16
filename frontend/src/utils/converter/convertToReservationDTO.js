import { formatDate } from "../date";

export const convertToReservationDTO = (stateData) => {
  const dto = {
    arrive_time: stateData.arriveTime,
    customer_phone_number: stateData.phoneNumber,
    num_people: stateData.numPeople,
    note: stateData.note,
    status: stateData.status,
    tables: (stateData.tables || []).map((table) => table.id),
  };

  if (stateData.customerId) {
    dto.customer_id = stateData.customerId;
  } else {
    dto.customer_name = stateData.customerName;
  }

  if (stateData.reject_reason) {
    dto.reject_reason = stateData.reject_reason;
  }

  return dto;
};

export const fromDTOToStateData = (dto) => ({
  ...dto,
  arriveTime: formatDate(new Date(dto.arrive_time), "YYYY-MM-DDThh:mm"),
  customerId: dto.customer_id,
  customerName: dto.customer_name,
  phoneNumber: dto.customer_phone_number,
  reject_reason: dto.reject_reason,
  note: dto.note,
  numPeople: dto.num_people,
  status: dto.status,
  tables: dto.tables || [],
});
