import React from 'react'

import { Card, CardContent, CardHeader, Divider, Typography } from '@material-ui/core'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import ReceiptIcon from '@material-ui/icons/Receipt'
import PeopleIcon from '@material-ui/icons/People'

import Main from '../../../containers/Main/Main'
import CustomAccordion from '../../../components/CustomAccordion/CustomAccordion'
import VerticalBarChart from '../../../components/Chart/VerticalBarChart'
import LineChart from '../../../components/Chart/LineChart'
import HorizontalBarChart from '../../../components/Chart/HorizontalBarChart'
// const defaultData = {
//   finishedOrders,
//   ongoingOrder,
// }

function Dashboard(props) {
  return (
    <Main>
      <Card style={{ marginBottom: '1rem' }}>
        <CardHeader title='Kết quả bán hàng hôm nay' />
        <CardContent>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginRight: '1rem', borderRight: '1px solid' }}>
              <MonetizationOnIcon />
              <div style={{ marginLeft: '1rem' }}>
                <Typography>4 đơn đã xong</Typography>
                <Typography variant='h6' color='primary'>
                  1,802,000
                </Typography>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginRight: '1rem', borderRight: '1px solid' }}>
              <ReceiptIcon />
              <div style={{ marginLeft: '1rem' }}>
                <Typography>0 đơn đang phục vụ</Typography>
                <Typography variant='h6' color='primary'>
                  0
                </Typography>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginRight: '1rem', borderRight: '1px solid' }}>
              <PeopleIcon />
              <div style={{ marginLeft: '1rem' }}>
                <Typography>Khách hàng</Typography>
                <Typography variant='h6' color='primary'>
                  0
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <CustomAccordion style={{ marginBottom: '2rem' }} title='DOANH THU THÁNG NÀY'>
        <div style={{ flex: 1 }}>
          <VerticalBarChart
            title='Doanh số tháng này'
            labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
            data={[
              {
                label: 'Dataset 1',
                data: [1, 2, 3, 4, 5, 6, 7],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'Dataset 2',
                data: [10, 11, 12, 13, 14, 15, 16],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ]}
          />
        </div>
      </CustomAccordion>
      <CustomAccordion style={{ marginBottom: '2rem' }} title='SỐ LƯỢNG KHÁCH THÁNG NÀY'>
        <div style={{ flex: 1 }}>
          <LineChart
            title='Số lượng khách'
            labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
            data={[
              {
                label: 'Dataset 1',
                data: [1, 2, 3, 4, 5, 6, 7],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'Dataset 2',
                data: [11, 12, 13, 14, 15, 16, 17],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ]}
          />
        </div>
      </CustomAccordion>
      <CustomAccordion style={{ marginBottom: '2rem' }} title='HÀNG HÓA BÁN CHẠY'>
        <div style={{ flex: 1 }}>
          <HorizontalBarChart
            title='Món bán chạy'
            labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
            data={[
              {
                label: 'Dataset 1',
                data: [1, 2, 3, 4, 5, 6, 7],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ]}
          />
        </div>
      </CustomAccordion>
    </Main>
  )
}

export default Dashboard

