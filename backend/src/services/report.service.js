const db = require('../database/models');
// const ApiError = require('../exceptions/api-error');
// const query = require('../utils/query');

const { Op } = db.Sequelize;

const {
  getCurMonth,
  formatDate,
  timeDiffInSeconds,
  getCurWeek,
} = require('../utils/date');

const getCurDateStatistics = async (curDate = new Date()) => {
  const start = new Date();
  const end = new Date();
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  const orders = await db.Order.findAll({
    where: {
      status: {
        [Op.notIn]: ['rejected', 'canceled', 'pending'],
      },
      created_at: {
        [Op.between]: [
          formatDate(start, 'YYYY-MM-DDThh:mm:ss'),
          formatDate(end, 'YYYY-MM-DDThh:mm:ss'),
        ],
      },
    },
    include: [
      {
        association: 'goods',
      },
      {
        association: 'invoice',
        attributes: ['paid_amount', 'created_at'],
      },
      {
        association: 'reservationTable',
        include: [
          {
            association: 'reservation',
            attributes: ['num_people'],
          },
        ],
      },
    ],
  });

  console.log('today orders: ', orders);

  return orders.reduce(
    (stats, order) => {
      if (order.status !== 'done') {
        stats.ongoingOrders = {
          quantity: stats.ongoingOrders.quantity + 1,
          revenue:
            stats.ongoingOrders.revenue +
            (order.goods || []).reduce(
              (total, good) =>
                total + good.sale_price * good.OrderDetail.quantity,
              0,
            ),
        };
      } else {
        stats.finishedOrders = {
          quantity: stats.ongoingOrders.quantity + 1,
          revenue: stats.ongoingOrders.revenue + order.invoice.paid_amount,
        };
      }
      if (order.type === 'dine-in') {
        stats.customerQuantity +=
          order.reservationTable?.reservation?.num_people || 0;
      } else if (order.type !== 'dine-in') {
        stats.customerQuantity += 1;
      }
      return stats;
    },
    {
      finishedOrders: {
        quantity: 0,
        revenue: 0,
      },
      ongoingOrders: {
        quantity: 0,
        revenue: 0,
      },
      customerQuantity: 0,
    },
  );
};

const getMonthRevenueStatistics = async (
  type = 'month',
  groupBy = 'dayInMonth',
) => {
  const now = new Date();
  const startOfDay = now;
  const endOfDay = now;
  startOfDay.setHours(0, 0, 0);
  endOfDay.setHours(23, 59, 59);

  const { start, end } =
    // eslint-disable-next-line no-nested-ternary
    type === 'month'
      ? getCurMonth(now)
      : type === 'week'
      ? getCurWeek(now)
      : { start: startOfDay, end: endOfDay };

  const orders = await db.Order.findAll({
    include: [
      {
        association: 'invoice',
        attributes: ['paid_amount', 'created_at'],
        where: {
          created_at: {
            [Op.between]: [
              formatDate(start, 'YYYY-MM-DDThh:mm:ss'),
              formatDate(end, 'YYYY-MM-DDThh:mm:ss'),
            ],
          },
        },
        required: true,
      },
    ],
  });

  if (groupBy === 'hourly') {
    const hours = [
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
    ];
    return orders.reduce(
      (stats, order) => {
        const invoiceCreatedTime = new Date(order.invoice.created_at);

        let minDiff = 100000;
        let minIdx = -1;

        hours.forEach((hour, idx) => {
          const [h, m] = hour.split(':');
          const compareDate = invoiceCreatedTime;
          compareDate.setHours(h, m);

          const timeDiff = timeDiffInSeconds(invoiceCreatedTime, compareDate);

          if (timeDiff < minDiff) {
            minDiff = timeDiff;
            minIdx = idx;
          }
        });

        if (order.type === 'dine-in') {
          stats.dinein[minIdx] += order.invoice.paid_amount;
        } else if (order.type === 'takeaway') {
          stats.takeaway[minIdx] += order.invoice.paid_amount;
        } else {
          stats.delivery[minIdx] += order.invoice.paid_amount;
        }

        return stats;
      },
      {
        dinein: Array(hours.length).fill(0),
        takeaway: Array(hours.length).fill(0),
        delivery: Array(hours.length).fill(0),
      },
    );
  }
  if (groupBy === 'dayInWeek') {
    return orders.reduce(
      (stats, order) => {
        const invoiceCreatedTime = new Date(order.invoice.created_at);
        const dayInWeek = invoiceCreatedTime.getDay();

        if (order.type === 'dine-in') {
          stats.dinein[dayInWeek] += order.invoice.paid_amount || 0;
        } else if (order.type === 'takeaway') {
          stats.takeaway[dayInWeek] += order.invoice.paid_amount || 0;
        } else {
          stats.delivery[dayInWeek] += order.invoice.paid_amount || 0;
        }

        return stats;
      },
      {
        dinein: Array(7).fill(0),
        takeaway: Array(7).fill(0),
        delivery: Array(7).fill(0),
      },
    );
  }
  if (groupBy === 'dayInMonth') {
    return orders.reduce((stats, order) => {
      const invoiceCreatedTime = new Date(order.invoice.created_at);
      const dayInMonth = invoiceCreatedTime.getDate();

      stats[dayInMonth] += order.invoice.paid_amount || 0;

      return stats;
    }, Array(31).fill(0));
  }
};

const getMonthCustomerQuantity = async (
  type = 'month',
  groupBy = 'dayInMonth',
) => {
  const now = new Date();
  const startOfDay = now;
  const endOfDay = now;
  startOfDay.setHours(0, 0, 0);
  endOfDay.setHours(23, 59, 59);

  const { start, end } =
    // eslint-disable-next-line no-nested-ternary
    type === 'month'
      ? getCurMonth(now)
      : type === 'week'
      ? getCurWeek(now)
      : { start: startOfDay, end: endOfDay };

  const orders = await db.Order.findAll({
    where: {
      created_at: {
        [Op.between]: [
          formatDate(start, 'YYYY-MM-DDThh:mm:ss'),
          formatDate(end, 'YYYY-MM-DDThh:mm:ss'),
        ],
      },
    },
    include: [
      {
        association: 'reservationTable',
        include: [
          {
            association: 'reservation',
            attributes: ['num_people'],
          },
        ],
      },
    ],
  });

  console.log('orders: ', orders);

  if (groupBy === 'hourly') {
    const hours = [
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
    ];
    return orders.reduce((stats, order) => {
      const createdTime = new Date(order.created_at);

      let minDiff = 100000;
      let minIdx = -1;

      hours.forEach((hour, idx) => {
        const [h, m] = hour.split(':');
        const compareDate = createdTime;
        compareDate.setHours(h, m);
        console.log('compare date: ', compareDate);

        const timeDiff = timeDiffInSeconds(createdTime, compareDate);

        if (timeDiff < minDiff) {
          minDiff = timeDiff;
          minIdx = idx;
        }
      });

      stats[minIdx] +=
        order.type === 'dine-in'
          ? order.reservationTable?.reservation?.num_people || 0
          : 1;

      return stats;
    }, Array(hours.length).fill(0));
  }
  if (groupBy === 'dayInWeek') {
    return orders.reduce((stats, order) => {
      const createdTime = new Date(order.created_at);
      const dayInWeek = createdTime.getDay();

      stats[dayInWeek] +=
        order.type === 'dine-in'
          ? order.reservationTable?.reservation?.num_people || 0
          : 1;

      return stats;
    }, Array(7).fill(0));
  }

  if (groupBy === 'dayInMonth') {
    return orders.reduce((stats, order) => {
      const createdTime = new Date(order.created_at);
      const dayInMonth = createdTime.getDate();

      stats[dayInMonth] +=
        order.type === 'dine-in'
          ? order.reservationTable?.reservation?.num_people || 0
          : 1;

      return stats;
    }, Array(31).fill(0));
  }
};

const getFavoriteItems = async (
  curDate = new Date(),
  type = 'quantity',
  limit = 5,
) => {
  const { start, end } = getCurMonth(curDate);
  const orders = await db.Order.findAll({
    where: {
      payment_status: 'paid',
      created_at: {
        [Op.between]: [start, end],
      },
    },
    include: [
      {
        association: 'goods',
        through: {
          attributes: ['quantity'],
          where: {
            status: {
              [Op.notIn]: ['canceled', 'rejected'],
            },
          },
        },
      },
    ],
  });

  const orderItems = orders.reduce((res, order) => {
    const goods = order.goods || [];
    for (const good of goods) {
      if (!res.some((item) => item.id === good.id)) {
        return [
          ...res,
          {
            id: good.id,
            name: good.name,
            sale_price: good.sale_price,
            quantity: good.OrderDetail?.quantity || 0,
          },
        ];
      }
      return res.map((item) =>
        item.id === good.id
          ? {
              ...item,
              quantity: item.quantity + good.OrderDetail?.quantity || 0,
            }
          : item,
      );
    }
    return res;
  }, []);

  console.log('favorite items: ', orderItems);

  if (type === 'quantity') {
    return orderItems
      .sort((first, second) => first.quantity - second.quantity)
      .reverse();
  } else {
    // sort by revenue
    return orderItems.sort(
      (first, second) =>
        first.quantity * first.sale_price - second.quantity * second.sale_price,
    );
  }
};

module.exports = {
  getMonthRevenueStatistics,
  getCurDateStatistics,
  getMonthCustomerQuantity,
  getFavoriteItems,
};
