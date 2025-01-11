import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { ProductProperty } from "../interfaces/Product";
import { useCart } from "../contexts/CartProvider";
import useAddToCart from "../hooks/useAddToCart";
import { useNavigate } from "react-router-dom";
import { toTitleCase } from "../functions/Capitalize";

interface FeaturedProductsProps {
  featuredProducts: ProductProperty[] | undefined;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  featuredProducts = [],
}) => {
  const { dispatch } = useCart();
  const { addToCart } = useAddToCart();
  const handelAddToCart = (product: ProductProperty) => {
    addToCart(product);
    dispatch({ type: "ADD_TO_CART", paylaod2: [], payload: product });
  };
  const nav = useNavigate();
  const theme = useTheme();
  const mode = theme.palette.mode;
  return (
    <Box className="container mx-auto px-4">
      <Typography variant="h4" align="center" color="secondary" mb={4}>
        Featured Products
      </Typography>
      {featuredProducts.length !== 0 ? (
        <Swiper
          navigation
          pagination={{ clickable: true }}
          modules={[A11y, Navigation, Pagination]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={4}
          style={{ padding: 2 }}
          breakpoints={{
            140: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide>
              <Box
                key={product._id}
                className={
                  mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
                }
                sx={{
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  boxShadow: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <Box onClick={() => nav(`/product/${product._id}`)}>
                  <img
                    src={product.image}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </Box>
                <Box p={2}>
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    mb={1}
                    onClick={() => nav(`/product/${product._id}`)}
                  >
                    {toTitleCase(product.name)}
                  </Typography>
                  <Typography
                    color="secondary"
                    mb={2}
                    onClick={() => nav(`/product/${product._id}`)}
                  >
                    ${product.price?.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => handelAddToCart(product)}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ShoppingCart style={{ marginRight: "8px" }} />
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Typography align="center" color="textSecondary" fontSize={"1rem"}>
          No featured products available.
        </Typography>
      )}
    </Box>
  );
};

export default FeaturedProducts;
