import { DeleteOutline } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { Box, Stack, useMediaQuery } from "@mui/system";
import { tokens } from "../theme";

export const SkeletonCategorty = () => {
  const theme = useTheme();
  const skeletonArray = new Array(8).fill(0);
  const mode = theme.palette.mode;
  return (
    <>
      <Grid container spacing={2}>
        {skeletonArray.map(() => (
          <Grid item xs={6} sm={6} md={4} lg={3}>
            <Card
              sx={{
                width: "100%",
                margin: "auto",
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
            >
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
              <CardActions>
                <Skeleton variant="rectangular" width="100px" height="36px" />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export const SkeletonCart = () => {
  const theme = useTheme();
  const skeletonArray = new Array(2).fill(0);

  const mode = theme.palette.mode;
  return (
    <>
      <Grid container width={"80%"} margin={"0 auto"} mt={7} padding={2}>
        <Grid item sm={12} md={6} lg={8} padding={2}>
          <Stack>
            {skeletonArray.map(() => {
              return (
                <Stack
                  mb={2}
                  direction="row"
                  className={
                    mode === "dark"
                      ? "Paper-overlay-Dark"
                      : "Paper-overlay-Light"
                  }
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    width={{ xs: "100%", sm: "80%", lg: "60%", xl: "50%" }}
                    alignItems="center"
                    gap={2}
                    sx={{
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      flexBasis={{ xs: "100%", sm: "30%" }}
                      height={{ xs: "auto", sm: "150px" }}
                      mr={{ xs: 0, sm: 2 }}
                      mb={{ xs: 2, sm: 0 }}
                    >
                      <Skeleton variant="rectangular" height={140} />
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      flex="1"
                      py={2}
                    >
                      <Typography variant="h6">
                        <Skeleton variant="text" width="60%" />
                        <Typography variant="body1" color="gray">
                          <Skeleton variant="text" width="40%" />{" "}
                        </Typography>
                      </Typography>
                      <IconButton aria-label="delete" color="error">
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  </Stack>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      color="secondary"
                      aria-label="decrease quantity"
                    >
                      -
                    </IconButton>
                    <Typography variant="body1">
                      <Skeleton variant="text" width="10px" />
                    </Typography>
                    <IconButton
                      color="secondary"
                      aria-label="increase quantity"
                    >
                      +
                    </IconButton>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      textAlign: "right",
                    }}
                  >
                    <Skeleton variant="text" width="13px" />
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Grid>
        <Grid item sm={12} md={6} lg={4} padding={2}>
          <Stack spacing={3}>
            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              padding={2}
            >
              <Typography variant="h6" color="secondary" marginBottom={2}>
                Order Summary
              </Typography>

              <Stack spacing={1} marginBottom={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Original Price</Typography>
                  <Typography>
                    <Skeleton variant="text" width="10px" />
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>Total</Typography>
                  <Typography>
                    <Skeleton variant="text" width="10px" />
                  </Typography>
                </Stack>
              </Stack>

              <Skeleton variant="rectangular" width="100%" height="36px" />
            </Box>

            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              padding={2}
            >
              <Typography marginBottom={2} fontSize="0.9rem">
                Do you have a coupon code or gift card?
              </Typography>

              <Skeleton variant="rectangular" width="100%" height="36px" />
              <Skeleton variant="rectangular" width="100%" height="36px" />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export const SkeletonRecommendations = () => {
  const theme = useTheme();
  const skeletonArray = new Array(3).fill(0);
  const mode = theme.palette.mode;

  return (
    <Stack mt={4} width={"80%"} margin={"0 auto"}>
      <Grid container spacing={2}>
        {skeletonArray.map(() => (
          <Grid
            item
            xs={12}
            sm={4}
            md={4}
            lg={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              sx={{
                width: "100%",
                height: "250px",
                borderRadius: "8px",

                padding: "8px",
                boxShadow: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Skeleton variant="rectangular" height={"100%"} width={"100%"} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export const SkeletonHome = () => {
  const theme = useTheme();
  const skeletonArray = new Array(4).fill(0);
  const mode = theme.palette.mode;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = tokens(theme.palette.mode);
  return (
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
        {skeletonArray.map(() => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={4}
            xl={3}
            height={"300px"}
            p={0.5}
            sx={{ cursor: "pointer" }}
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
              <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export const SkeletonAnalytics = () => {
  const theme = useTheme();
  const skeletonArray = new Array(4).fill(0);
  const mode = theme.palette.mode;

  return (
    <>
      <Grid container justifyContent="center" spacing={2}>
        {skeletonArray.map(() => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              bgcolor={mode === "dark" ? "#004d4c" : "#348c73"}
              borderRadius={"5px"}
              display={"flex"}
              justifyContent={"space-between"}
              sx={{ position: "relative" }}
              overflow={"hidden"}
            >
              <Skeleton variant="rectangular" width={"100%"} height={85} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export const SkeletonFeatured = () => {
  const theme = useTheme();
  let skeletonArray = new Array(1).fill(0);

  const isSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMeduim = useMediaQuery(theme.breakpoints.down("md"));
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const isXLarge = useMediaQuery(theme.breakpoints.down("xl"));
  const mode = theme.palette.mode;

  if (isSmall) {
    skeletonArray = new Array(1).fill(0);
    return (
      <Grid container spacing={2}>
        {skeletonArray.map(() => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              sx={{
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box>
                <Skeleton variant="rectangular" height={200} />
              </Box>
              <Box p={2}>
                <Typography variant="h6" color="textPrimary" mb={1}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>
                <Typography color="secondary" mb={2}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>

                <Skeleton variant="rectangular" width="100%" height="36px" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
  if (isMobile) {
    skeletonArray = new Array(1).fill(0);
    return (
      <Grid container spacing={2}>
        {skeletonArray.map(() => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              sx={{
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box>
                <Skeleton variant="rectangular" height={200} />
              </Box>
              <Box p={2}>
                <Typography variant="h6" color="textPrimary" mb={1}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>
                <Typography color="secondary" mb={2}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>

                <Skeleton variant="rectangular" width="100%" height="36px" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
  if (isMeduim) {
    skeletonArray = new Array(2).fill(0);
    return (
      <Grid container spacing={2}>
        {skeletonArray.map(() => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              sx={{
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box>
                <Skeleton variant="rectangular" height={200} />
              </Box>
              <Box p={2}>
                <Typography variant="h6" color="textPrimary" mb={1}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>
                <Typography color="secondary" mb={2}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>

                <Skeleton variant="rectangular" width="100%" height="36px" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
  if (isLarge) {
    skeletonArray = new Array(3).fill(0);
    return (
      <Grid container spacing={2}>
        {skeletonArray.map(() => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              sx={{
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box>
                <Skeleton variant="rectangular" height={200} />
              </Box>
              <Box p={2}>
                <Typography variant="h6" color="textPrimary" mb={1}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>
                <Typography color="secondary" mb={2}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>

                <Skeleton variant="rectangular" width="100%" height="36px" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
  if (isXLarge) {
    skeletonArray = new Array(4).fill(0);
    return (
      <Grid container spacing={2}>
        {skeletonArray.map(() => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              className={
                mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
              }
              sx={{
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box>
                <Skeleton variant="rectangular" height={200} />
              </Box>
              <Box p={2}>
                <Typography variant="h6" color="textPrimary" mb={1}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>
                <Typography color="secondary" mb={2}>
                  <Skeleton variant="rectangular" width="5%" height="15px" />
                </Typography>

                <Skeleton variant="rectangular" width="100%" height="36px" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
};

export const SkeletonMyOrders = () => {
  const skeletonArray = new Array(2).fill(0);

  return (
    <>
      <Stack>
        <Grid container width={"80%"} margin={"0 auto"} mt={1} padding={2}>
          {skeletonArray?.map(() => (
            <Grid item xs={12} mb={4}>
              <Box>
                <Skeleton height={200} width={"100%"} />
              </Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Skeleton height={"15px"} width={"20px"} />
                <Skeleton height={"15px"} width={"20px"} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  );
};

export const SkeletonProductDetails = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = theme.palette;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack
      width={isMobile ? "90%" : isMedium ? "80%" : "75%"}
      m={"0 auto"}
      mt={7}
    >
      <Grid container height={"75vh"}>
        <Grid item xs={12} sm={7} md={6} lg={6} p={2} height={"100%"}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor:
                mode === "dark" ? colors.grey[800] : colors.grey[300],
              borderRadius: "8px",
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: "8px" }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={5} md={6} lg={6} p={2}>
          <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="30%" height={25} sx={{ mb: 3 }} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={60}
            sx={{ mb: 3 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={50}
            sx={{
              mt: 3,
              backgroundColor:
                mode === "dark" ? colors.grey[700] : colors.grey[200],
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
