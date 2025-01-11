import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import useGetRecommendedProducts from "../../hooks/useGetRecommendedProducts";
import { ProductProperty } from "../../interfaces/Product";
import { SkeletonRecommendations } from "../../components/Skeletons";
import { useNavigate } from "react-router-dom";

function Recommendations() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mode = theme.palette.mode;
  const [products, setProducts] = useState<ProductProperty[] | undefined>(
    undefined
  );
  const nav = useNavigate();
  const { isLoading, getRecommendedProducts } = useGetRecommendedProducts();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const data = await getRecommendedProducts();
      setProducts(data);
    };
    fetchRecommendations();
  }, []);

  if (isLoading) return <SkeletonRecommendations />;

  return (
    <>
      {products?.map((product) => (
        <Grid
          key={product._id}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            nav(`/product/${product._id}`);
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "250px",
              backgroundColor:
                mode === "dark" ? colors.grey[500] : colors.grey[600],
              borderRadius: "8px",
              padding: "5px",
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          </Box>
        </Grid>
      ))}
    </>
  );
}

export default Recommendations;
