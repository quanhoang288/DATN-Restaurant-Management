const ExcelJS = require('exceljs');
const path = require('path');

const wb = new ExcelJS.Workbook();

const parseFile = async (
  filePath,
  isAbsolutePath = true,
  sheetName = 'Sheet1',
) => {
  const fullPath = isAbsolutePath
    ? filePath
    : path.resolve(__dirname, filePath);
  const rows = [];
  try {
    await wb.xlsx.readFile(fullPath);
    const sheet = wb.getWorksheet(sheetName);

    let curRow;
    for (let i = 1; i <= sheet.rowCount; i += 1) {
      curRow = [];
      for (let j = 1; j <= sheet.columnCount; j += 1) {
        curRow.push(sheet.getRow(i).getCell(j).value);
      }
      if (!curRow.some((cellVal) => cellVal !== null)) {
        break;
      }
      rows.push(curRow);
    }
  } catch (error) {
    console.log(error);
  }

  return rows;
};

module.exports = parseFile;
