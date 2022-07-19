const formatDate = (date, format) => {
  const year = date.getFullYear();
  const month = `00${1 + date.getMonth()}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  const hour = `00${date.getHour()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  const second = `00${date.getSeconds()}`.slice(-2);
  const millisecond = `000${date.getMiliseconds()}`.slice(-2);

  format = format.replace(/YYYY/g, `${year}`);
  format = format.replace(/MM/g, `${month}`);
  format = format.replace(/DD/g, `${day}`);
  format = format.replace(/hh/g, `${hour}`);
  format = format.replace(/mm/g, `${minute}`);
  format = format.replace(/ss/g, `${second}`);
  format = format.replace(/ms/g, `${millisecond}`);

  return format;
};

module.exports = {
  formatDate,
};
