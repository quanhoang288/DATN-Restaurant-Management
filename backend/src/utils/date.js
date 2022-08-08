const formatDate = (date, format) => {
  const year = date.getFullYear();
  const month = `00${1 + date.getMonth()}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  const second = `00${date.getSeconds()}`.slice(-2);
  const millisecond = `000${date.getMilliseconds()}`.slice(-2);

  format = format.replace(/YYYY/g, `${year}`);
  format = format.replace(/MM/g, `${month}`);
  format = format.replace(/DD/g, `${day}`);
  format = format.replace(/hh/g, `${hour}`);
  format = format.replace(/mm/g, `${minute}`);
  format = format.replace(/ss/g, `${second}`);
  format = format.replace(/ms/g, `${millisecond}`);

  return format;
};

const getCurWeek = (curDate) => {
  const first = curDate.getDate() - curDate.getDay(); // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6

  return {
    start: new Date(curDate.setDate(first)).toUTCString(),
    end: new Date(curDate.setDate(last)).toUTCString(),
  };
};

const getCurMonth = (curDate) => ({
  start: new Date(curDate.getFullYear(), curDate.getMonth(), 1),
  end: new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0),
});

const timeDiffInSeconds = (firstDate, secondDate) =>
  Math.abs((firstDate.getTime() - secondDate.getTime()) / 1000);

module.exports = {
  formatDate,
  getCurWeek,
  getCurMonth,
  timeDiffInSeconds,
};
