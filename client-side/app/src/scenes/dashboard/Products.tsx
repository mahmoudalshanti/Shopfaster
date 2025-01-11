import { useEffect, useState } from "react";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/system";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DeleteOutline, Star, StarOutline } from "@mui/icons-material";
import useGetAllProducts from "../../hooks/useGetAllProducts";
import { useProducts } from "../../contexts/ProductsProvider";
import Loading from "../../components/Loading";
import useUpdateProduct from "../../hooks/useUpdateProducts";
import useDeleteProduct from "../../hooks/useDeleteProducts";
import { motion } from "framer-motion";
import { useUser } from "../../contexts/UserProvider";
import { ProductProperty } from "../../interfaces/Product";

function Products(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getAllProducts, isLoading } = useGetAllProducts();
  const [idOnLoading, setIdOnLoading] = useState<string | null>(null);

  const { products, dispatch } = useProducts();

  const { user } = useUser();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getAllProducts();
        console.log("SSS");
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    if (user.name) fetchProducts();
  }, []);

  const { isLoading: isLoadingUpdate, updateProduct } = useUpdateProduct();
  const setFeaturedProduct = async (product: ProductProperty) => {
    setIdOnLoading(product._id);
    await updateProduct(product._id);
    dispatch({
      type: "SET_IS_FEATURED",
      payload: { ...product },
      paylaod2: [],
    });
  };
  const { isLoading: isLoadingDelete, deleteProduct } = useDeleteProduct();
  const setDeleteProduct = async (product: ProductProperty) => {
    setIdOnLoading(product._id);
    await deleteProduct(product._id);
    dispatch({ type: "DELETE_PRODUCT", payload: { ...product }, paylaod2: [] });
  };

  return (
    <Stack
      height={products.length === 0 ? "40vh" : ""}
      width={isMobile ? "90%" : "60%"}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <TableContainer component={Paper}>
          <Table
            sx={{ width: "100%" }}
            className={
              theme.palette.mode === "dark"
                ? "Paper-overlay-Dark"
                : "Paper-overlay-Light"
            }
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>PRODUCT</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>PRICE</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>CATEGORY</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>IN STOCK</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>FEATURED</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>ACTION</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell
                      align="left"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box width="50px" height="50px" borderRadius="50%">
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Typography ml={2}>{product.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>${product.price.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="center">{product.category}</TableCell>
                    <TableCell align="center">111</TableCell>
                    <TableCell align="center">
                      {isLoadingUpdate && product._id === idOnLoading ? (
                        <Loading size="small" />
                      ) : (
                        <IconButton
                          onClick={() => setFeaturedProduct(product)}
                          sx={{ margin: "0 auto" }}
                        >
                          {product.isFeatured ? (
                            <Star color="secondary" />
                          ) : (
                            <StarOutline color="secondary" />
                          )}
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isLoadingDelete && product._id === idOnLoading ? (
                        <Loading size="small" />
                      ) : (
                        <IconButton
                          onClick={() => setDeleteProduct(product)}
                          sx={{ margin: "0 auto" }}
                        >
                          <DeleteOutline color="error" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {isLoading ? (
                      <Loading size={"medium"} />
                    ) : (
                      <Typography fontSize={"1.2rem"}>
                        No products available
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Stack>
  );
}

export default Products;
