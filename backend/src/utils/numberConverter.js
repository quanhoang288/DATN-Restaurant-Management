const convertToNumber = (data = {}, exclude = []) => {
  for (const [key, value] of Object.entries(data)) {
    if (value && !exclude.includes(key)) {
      if (typeof value === 'object') {
        console.log('object key: ', key);
        data[key] = convertToNumber(value);
      } else if (Array.isArray(value)) {
        console.log('array key: ', key);

        data[key] = value.map((item) => convertToNumber(item));
      } else {
        console.log('default key: ', key);

        // eslint-disable-next-line no-restricted-globals
        data[key] = !isNaN(Number.parseFloat(value))
          ? Number.parseFloat(value)
          : value;
      }
    }
  }
  return data;
};

module.exports = convertToNumber;
