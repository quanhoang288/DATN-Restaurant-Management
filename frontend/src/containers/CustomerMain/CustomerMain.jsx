import React from 'react'
import CustomerFooter from '../../components/Footer/CustomerFooter'
import CustomerHeader from '../../components/Header/CustomerHeader'

function CustomerMain({ includeFooter, children }) {
  return (
    <>
      <section>
        <header>
          <CustomerHeader />
        </header>
      </section>
      <section style={{ height: '80vh' }}>
        <div style={{ background: '#f5f5f5', height: '100%' }}>{children}</div>
      </section>
      {includeFooter && <section>{/* <CustomerFooter /> */}</section>}
    </>
  )
}

CustomerMain.defaultProps = {
  includeFooter: true,
}

export default CustomerMain

