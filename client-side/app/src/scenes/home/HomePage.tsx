import { Grid, Typography } from "@mui/material";
import bags from "/bags.jpg";
import glasses from "/glasses.png";
import jackets from "/jackets.jpg";
import jeans from "/jeans.jpg";
import suits from "/suits.jpg";
import tshirts from "/tshirts.jpg";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import FeaturedProducts from "../../components/FeaturedProducts";
import { useEffect, useState } from "react";
import useGetFeaturedProducts from "../../hooks/useGetFeaturedProducts";
import { ProductProperty } from "../../interfaces/Product";
import { SkeletonFeatured } from "../../components/Skeletons";
import Footer from "../global/Footer";
import { Blurhash } from "react-blurhash";

function HomePage(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = tokens(theme.palette.mode);
  const mode = theme.palette.mode;
  const nav = useNavigate();
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );

  const images: {
    img: string;
    title: string;
    hash: string;
  }[] = [
    {
      img: bags,
      title: "Bags",
      hash: "L25;,KaM0zS2juoLR+WW0#W:^PoL",
    },
    {
      img: glasses,
      title: "Glasses",
      hash: "L3An*b%u0vIVMBaQNYot0]n-=*M}",
    },
    {
      img: jackets,
      title: "Jackets",
      hash: "LTJRaM4Tj]t7_NRP-;R*V@x]IUad",
    },
    {
      img: jeans,
      title: "Jeans",
      hash: "L99@ktMdMwD*~8-;kXRj?D-;Rkad",
    },
    {
      img: suits,
      title: "Suits",
      hash: "LEA]seRjjEsl~A%2NGxGIUxZt8ay",
    },
    {
      img: tshirts,
      title: "T-shirts",
      hash: "LQKBE^^-E0M|%LMxE0NF00E1oNM{",
    },
  ];

  useEffect(() => {
    const loadImages = async () => {
      const imageLoadPromises = images.map((image) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages((prev) => ({ ...prev, [image.img]: true }));
            resolve();
          };
          img.onerror = () => resolve();
          img.src = image.img;
        });
      });

      await Promise.all(imageLoadPromises);
    };

    loadImages();
  }, []);

  const { isLoading, getFeaturedProduct } = useGetFeaturedProducts();
  const [products, setProducts] = useState<ProductProperty[] | undefined>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await getFeaturedProduct();
      setProducts(data);
    };
    fetchFeatured();
  }, []);

  return (
    <>
      <Stack width={isMobile ? "90%" : "75%"} margin={"0 auto"} mt={7}>
        <Typography
          textAlign={"center"}
          color={mode === "dark" ? colors.green[500] : colors.green[300]}
          fontWeight={"bold"}
          fontSize={"2.5rem"}
        >
          Explore Our Categories
        </Typography>
        <Typography textAlign={"center"} fontSize={"1rem"} mb={3}>
          Discover the latest brands in eco-friendly fashion.
        </Typography>
        <Grid container>
          {images.map((image) => (
            <Grid
              key={image.hash}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              height={"300px"}
              p={0.5}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                nav(`/category/` + image.title.toLowerCase());
              }}
            >
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: "8px",
                  height: "100%",
                  width: "100%",
                  position: "relative",
                }}
              >
                {!loadedImages[image.img] && (
                  <Blurhash
                    hash={image.hash}
                    width={"100%"}
                    height={"100%"}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                  />
                )}
                {loadedImages[image.img] && (
                  <img
                    src={image.img}
                    alt={image.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      transition: "transform 0.3s ease",
                      objectFit: "cover",
                    }}
                    className="hover-zoom"
                  />
                )}

                <Typography
                  position={"absolute"}
                  left={"10px"}
                  bottom={"10px"}
                  fontSize={"1.2rem"}
                  color={"#fff"}
                >
                  {image.title}
                  <Typography fontSize={".8rem"}>
                    Explore {image.title}
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
      <Box py={10} width={isMobile ? "90%" : "75%"} margin={"0 auto"} mt={7}>
        {isLoading ? (
          <SkeletonFeatured />
        ) : (
          <FeaturedProducts featuredProducts={products} />
        )}
      </Box>
      <Footer />
    </>
  );
}

export default HomePage;
