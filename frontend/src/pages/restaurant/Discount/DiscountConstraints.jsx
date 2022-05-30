import React, { useEffect, useState } from 'react'
import {
  Button,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import DeleteIcon from '@material-ui/icons/Delete'
import RemoveIcon from '@material-ui/icons/Remove'
import CustomAccordion from '../../../components/CustomAccordion/CustomAccordion'

function DiscountContraints(props) {
  const { constraints, type, method, handleAddConstraintInput, handleChangeConstraintRow, handleDeleteConstraint } = props

  const renderTableHead = (type, method) => {
    switch (type) {
      case 'invoice':
        return method === 'invoice-discount' ? (
          <>
            <TableCell>Tổng tiền hàng</TableCell>
            <TableCell>Giảm giá</TableCell>
            <TableCell>Hành động</TableCell>
          </>
        ) : (
          <>
            <TableCell>Tổng tiền hàng</TableCell>
            <TableCell>Tặng tổng</TableCell>
            <TableCell colSpan={2}>Hàng/Nhóm hàng</TableCell>
            <TableCell align='center'>Hành động</TableCell>
          </>
        )

      case 'good':
        return (
          <>
            <TableCell>Số lượng</TableCell>
            <TableCell>Hàng/Nhóm hàng mua</TableCell>
            <TableCell>Giảm giá</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Hàng/Nhóm hàng được giảm giá</TableCell>
            <TableCell>Hành động</TableCell>
          </>
        )

      default:
        return null
    }
  }

  const renderTableBody = (type, method, rows = []) => {
    switch (type) {
      case 'invoice':
        return method === 'invoice-discount'
          ? rows.map((row, idx) => (
              <TableRow>
                <TableCell>
                  <TextField
                    label='Từ'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type='number'
                    value={row.from}
                    onChange={(e) => handleChangeConstraintRow(idx, 'from', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.discountAmount}
                    onChange={(e) => handleChangeConstraintRow(idx, 'discountAmount', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ToggleButtonGroup
                            size='small'
                            exclusive
                            value={row.discountUnit}
                            onChange={(e, newVal) => handleChangeConstraintRow(idx, 'discountUnit', newVal)}
                            style={{ marginBottom: '1rem' }}
                          >
                            <ToggleButton value='cash'>VND</ToggleButton>
                            <ToggleButton value='percent'>%</ToggleButton>
                          </ToggleButtonGroup>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteConstraint(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          : rows.map((row, idx) => (
              <TableRow>
                <TableCell>
                  <TextField
                    label='Từ'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type='number'
                    value={row.from}
                    onChange={(e) => handleChangeConstraintRow(idx, 'from', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={row.buyQuantity}
                    onChange={(e) => handleChangeConstraintRow(idx, 'buyQuantity', e.target.value)}
                    style={{ maxWidth: 80 }}
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  <Autocomplete
                    className='navbar__searchBar__container'
                    id='free-solo-2-demo'
                    options={[]}
                    multiple
                    // inputValue={componentKeyword}
                    // value={null}
                    // onInputChange={(e, val) => setComponentKeyword(val)}
                    getOptionLabel={(option) => option.name}
                    filterOptions={(options, state) => options}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </TableCell>
                <TableCell align='center'>
                  <IconButton onClick={() => handleDeleteConstraint(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))

      case 'good':
        return (
          <TableRow>
            <TableCell>
              <TextField type='number' style={{ maxWidth: 80, marginRight: 10 }} InputLabelProps={{ shrink: true }} />
            </TableCell>
            <TableCell>
              <Autocomplete
                className='navbar__searchBar__container'
                id='free-solo-2-demo'
                options={[]}
                multiple
                getOptionLabel={(option) => option.name}
                filterOptions={(options, state) => options}
                renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} fullWidth {...params} />}
              />
            </TableCell>
            <TableCell>
              <TextField
                type='number'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <ToggleButtonGroup size='small' style={{ marginBottom: '1rem' }}>
                        <ToggleButton>VND</ToggleButton>
                        <ToggleButton>%</ToggleButton>
                      </ToggleButtonGroup>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </TableCell>
            <TableCell>
              <TextField type='number' style={{ maxWidth: 80, marginRight: 10 }} InputLabelProps={{ shrink: true }} />
            </TableCell>
            <TableCell>
              <Autocomplete
                className='navbar__searchBar__container'
                id='free-solo-2-demo'
                options={[]}
                multiple
                getOptionLabel={(option) => option.name}
                filterOptions={(options, state) => options}
                renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} fullWidth {...params} />}
              />
            </TableCell>
            <TableCell>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        )

      default:
        return
    }
  }

  return (
    <div>
      {method === 'good-discount' ? (
        <CustomAccordion>
          <div>
            <Autocomplete
              className='navbar__searchBar__container'
              id='free-solo-2-demo'
              options={[]}
              multiple
              // inputValue={componentKeyword}
              // value={null}
              // onInputChange={(e, val) => setComponentKeyword(val)}
              getOptionLabel={(option) => option.name}
              filterOptions={(options, state) => options}
              renderInput={(params) => (
                <TextField
                  label='Khi mua'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  {...params}
                />
              )}
            />
          </div>
          <div>
            <div>
              <div style={{ display: 'flex' }}>
                <TextField type='number' label='Số lượng từ' InputLabelProps={{ shrink: true }} />
                <TextField select SelectProps={{ native: true }}>
                  <option value='price'>Giá bán</option>
                  <option value='discount'>Giảm giá</option>
                </TextField>
                <TextField type='number' />
                <IconButton>
                  <RemoveIcon />
                </IconButton>
              </div>
            </div>

            <Button variant='outlined' color='primary'>
              Thêm dòng
            </Button>
          </div>
        </CustomAccordion>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>{renderTableHead(type, method)}</TableRow>
            </TableHead>
            <TableBody>{renderTableBody(type, method, constraints)}</TableBody>
          </Table>
        </TableContainer>
      )}

      <div>
        <Button variant='contained' onClick={handleAddConstraintInput}>
          Thêm điều kiện
        </Button>
      </div>
    </div>
  )
}

export default DiscountContraints

