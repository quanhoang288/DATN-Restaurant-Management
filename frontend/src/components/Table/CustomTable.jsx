import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { Button, TextField, Typography } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import pick from "../../utils/pick";
import ChipLabel from "../ChipLabel/ChipLabel";
import { useEffect } from "react";
import { ASSET_BASE_URL } from "../../configs";
import noImageAvailable from "../../assets/no-image-available.jpg";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, cols, actionButtons } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {(cols || []).map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align ?? "left"}
            padding='normal'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {(actionButtons || []).length > 0 && (
          <TableCell align='center'>Hành động</TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  // orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableRow(props) {
  const { row, actionButtons, cols } = props;

  return (
    <TableRow hover tabIndex={-1}>
      {Object.keys(row).map((field, idx) => (
        <TableCell>
          {(cols || [])[idx].type === "chip" ? (
            <ChipLabel
              label={row[field]?.name ?? row[field]}
              variant={
                cols[idx].variantMapping.find(
                  (mapping) => mapping.value === row[field]?.value ?? row[field]
                )?.variant
              }
            />
          ) : (cols || [])[idx].type === "image" ? (
            <img
              src={
                row[field]
                  ? `${ASSET_BASE_URL}/images/${row[field]}`
                  : noImageAvailable
              }
              alt='profile-preview'
              style={{ maxWidth: 50, minHeight: 30, maxHeight: 50 }}
            />
          ) : (
            row[field]?.name ?? row[field]
          )}
        </TableCell>
      ))}

      {(actionButtons || []).length > 0 && (
        <TableCell align='center'>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {actionButtons.map((btn) => (
              <Button
                variant={btn.variant}
                color={btn.color}
                onClick={(e) => btn.clickHandler(row.id)}
                style={{ marginRight: 5 }}
              >
                {btn.name}
              </Button>
            ))}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const {
    rows,
    totalCount,
    cols,
    actionButtons,
    paginationEnabled,
    handleFetchRows,
    searchParams,
    refreshing,
    handleRefresh,
    filterEnabled,
  } = props;

  console.log(rows);

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (handleFetchRows) {
      handleFetchRows(page + 1, rowsPerPage, searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchParams]);

  useEffect(() => {
    if (handleRefresh && refreshing) {
      handleRefresh(1, rowsPerPage, searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing, rowsPerPage, searchParams]);

  return (
    <div className={classes.root}>
      {(rows || []).length > 0 ? (
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby='tableTitle'
              size='medium'
              aria-label='enhanced table'
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                cols={cols}
                actionButtons={actionButtons}
              />
              <TableBody>
                {stableSort(rows || [], getComparator(order, orderBy)).map(
                  (row, index) => {
                    return (
                      <EnhancedTableRow
                        row={pick(
                          row,
                          (cols || []).map((col) => col.id)
                        )}
                        cols={cols}
                        actionButtons={actionButtons}
                      />
                    );
                  }
                )}
                {rowsPerPage - Math.min(rowsPerPage, (rows || []).length) >
                  0 && (
                  <TableRow
                    style={{
                      height:
                        50 *
                        (rowsPerPage -
                          Math.min(rowsPerPage, (rows || []).length)),
                    }}
                  >
                    <TableCell colSpan={(cols || []).length} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {paginationEnabled && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={totalCount || (rows || []).length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      ) : (
        <Typography variant='h6'>Không có dữ liệu</Typography>
      )}
    </div>
  );
}

EnhancedTable.defaultProps = {
  paginationEnabled: true,
  searchParams: {},
  refreshing: false,
  filterEnabled: false,
};
