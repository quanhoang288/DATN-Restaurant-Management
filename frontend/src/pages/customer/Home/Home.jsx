import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { Button, Card, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getDiscount, getDiscounts } from "../../../apis/discount";

import CustomCarousel from "../../../components/Carousel/Carousel";
import SlickList from "../../../components/SlickList/SlickList";
import CustomerMain from "../../../containers/CustomerMain/CustomerMain";
import noImageAvailable from "../../../assets/no-image-available.jpg";
import { ASSET_BASE_URL } from "../../../configs";
import Modal from "../../../components/Modal/Modal";

function DiscountItem({ discount, handleViewDetail }) {
  return (
    <Card
      style={{
        border: "1px #fefefe",
        borderRadius: 15,
        minWidth: 300,
        maxWidth: 400,
        marginRight: "2rem",
      }}
    >
      <CardActionArea onClick={() => handleViewDetail(discount.id)}>
        <CardMedia
          component='img'
          alt='Discount thumbnail'
          style={{ maxHeight: 150, maxWidth: 300 }}
          image={
            discount.image
              ? `${ASSET_BASE_URL}/images/${discount.image}`
              : noImageAvailable
          }
          title='Discount thumbnail'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {discount.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ alignSelf: "center" }}>
        <Button
          size='small'
          color='primary'
          onClick={() => handleViewDetail(discount.id)}
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
}

function DiscountModal({ discount, handleCloseModal }) {
  return (
    <Modal
      title={discount.name}
      isModalVisible={true}
      handleClose={handleCloseModal}
    >
      <div dangerouslySetInnerHTML={{ __html: discount.description }}></div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <Button variant='contained' color='info' onClick={handleCloseModal}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
}

function Home(props) {
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const fetchDiscounts = async () => {
    const res = await getDiscounts({
      filters: JSON.stringify({ is_active: 1 }),
    });
    if (res) {
      setDiscounts(res.data);
    }
  };

  const handleViewDiscount = async (discountId) => {
    const discount = (await getDiscount(discountId)).data;
    console.log("discount: ", discount);
    setSelectedDiscount(discount);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <CustomerMain>
      {selectedDiscount && (
        <DiscountModal
          discount={selectedDiscount}
          handleCloseModal={() => setSelectedDiscount(null)}
        />
      )}
      <div style={{ background: "white" }}>
        <div className='advertisement' style={{ marginTop: "1rem" }}>
          <CustomCarousel>
            <Paper>
              <img
                src='https://cdn.lauphan.com/photo-storage/myFile-1651677819530.jpeg'
                alt='advertisement'
                height={500}
                width='100%'
              />
            </Paper>
            <Paper>
              <img
                src='https://cdn.lauphan.com/photo-storage/myFile-1651677819530.jpeg'
                alt='advertisement'
                height={500}
                width='100%'
              />
            </Paper>
          </CustomCarousel>
        </div>

        {discounts.length > 0 && (
          <div
            style={{ marginTop: "1rem", padding: "1rem 3rem", width: "100%" }}
          >
            <Typography variant='h5' style={{ marginBottom: "1rem" }}>
              Khuyến mãi
            </Typography>
            <div style={{ display: "flex", width: "100%" }}>
              {discounts.map((discount) => (
                <>
                  <DiscountItem
                    discount={discount}
                    handleViewDetail={handleViewDiscount}
                  />
                </>
              ))}
            </div>
            {/* <SlickList>
              {discounts.map((discount) => (
                <>
                  <DiscountItem
                    discount={discount}
                    handleViewDetail={handleViewDiscount}
                  />
                  <DiscountItem
                    discount={discount}
                    handleViewDetail={handleViewDiscount}
                  />
                  <DiscountItem
                    discount={discount}
                    handleViewDetail={handleViewDiscount}
                  />
                </>
              ))}
            </SlickList> */}
          </div>
        )}
      </div>
    </CustomerMain>
  );
}

export default Home;
