import React from 'react'

const CustomerFooter = () => {
  return (
    <footer id='footer' class='bs-docs-footer' style={{ background: '#df5800bf', position: 'fixed', bottom: 0, width: '100%' }}>
      <div class='container'>
        <div class='row'>
          <div class='col-12 col-md-6'>
            <div class='info-bot'>
              <div class='nameCtybot'>Công ty Cổ phần CAM</div>
              <div>Địa chỉ: ABC, XYZ</div>
              <div>Mã số thuế: 0108796725</div>
              <div>Ngày hoạt động: 25/06/2019</div>
              <div>Giấy phép kinh doanh: 0108796725</div>
            </div>
          </div>
          <div class='col-12 col-md-6'>
            <div class='box-footer-r' style={{ display: 'flex' }}>
              <div>
                <a href='https://www.facebook.com/phanexpress' target='_blank'>
                  <img src='/WebLauPhan/theme/icon-fb.svg' />
                </a>
              </div>
              <div>
                <a href='https://www.instagram.com/lau.phan/' target='_blank'>
                  <img src='/WebLauPhan/theme/icon-ins.svg' />
                </a>
              </div>
              <div>
                <a href='https://www.tiktok.com/@lau.phan' target='_blank'>
                  <img src='/WebLauPhan/theme/icon-tiktok.svg' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CustomerFooter

