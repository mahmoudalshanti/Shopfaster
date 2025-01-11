import { Badge, Button, IconButton, Menu, Typography } from "@mui/material";
import { Box, Container, Stack, useMediaQuery, useTheme } from "@mui/system";
import { tokens, useColorMode } from "../../theme";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import LogoutIcon from "@mui/icons-material/Logout";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useLocation, useNavigate } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect, useState } from "react";
import useLogout from "../../hooks/useLogout";
import { useUser } from "../../contexts/UserProvider";
import { useCart } from "../../contexts/CartProvider";
import { LoginOutlined } from "@mui/icons-material";
import Logo from "../../components/Logo";

function Navbar(): JSX.Element {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useUser();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);
  const handleNavigation = (path: string) => {
    setActive(path);
    navigate(path);
  };
  return (
    <Stack
      p={2}
      bgcolor={colors.primary[400]}
      boxShadow={
        theme.palette.mode === "dark"
          ? "2px 2px 20px 0px rgba(33, 100, 83, 0.61)"
          : "2px 2px 20px 0px #94e2cd"
      }
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box onClick={() => handleNavigation("/")}>
          <Logo />
        </Box>
        <Box display="flex" alignItems="center">
          {!user.name && (
            <Button
              startIcon={<LoginOutlined />}
              onClick={() => handleNavigation("/login")}
              color="secondary"
              variant={active === "/login" ? "outlined" : "contained"}
              sx={{
                color: active === "/login" ? colors.green[200] : "white",
                mr: 2,
              }}
              size="small"
            >
              {!isMobile && "Login"}
            </Button>
          )}
          <ResponsiveNavbar active={active} setActive={setActive} />
        </Box>
      </Container>
    </Stack>
  );
}

const ResponsiveNavbar: React.FC<{
  active: string;
  setActive: (path: string) => void;
}> = ({ active, setActive }): JSX.Element => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { success, logout } = useLogout();
  const { user } = useUser();
  const { cart } = useCart();
  const { toggleColorMode } = useColorMode();

  useEffect(() => {
    if (success) navigate("/login");
  }, [success]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    setActive(path);
    navigate(path);
    setAnchorEl(null); // Close menu when navigating
  };

  const navItems = (
    <Box
      display="flex"
      p={isMedium ? 1 : 0}
      alignItems="center"
      flexDirection={isMobile ? "column" : "row"}
      gap={isMedium ? 2 : 0}
      justifyContent="center"
    >
      {user.name && (
        <Typography
          onClick={() => handleNavigation("/")}
          color={active === "/" ? colors.green[200] : "inherit"}
          sx={{ cursor: "pointer", mr: !isMedium ? "1.2rem" : 0 }}
        >
          Home
        </Typography>
      )}
      {user.name && (
        <Typography
          onClick={() => handleNavigation("/cart")}
          color={active === "/cart" ? colors.green[200] : "inherit"}
          sx={{ cursor: "pointer", mr: !isMedium ? "1.2rem" : 0 }}
        >
          <Badge badgeContent={cart.length} color="secondary">
            <AddShoppingCartIcon />
          </Badge>
          {!isMedium && "Cart"}
        </Typography>
      )}
      {user.role === "admin" && (
        <Button
          startIcon={<LockPersonIcon />}
          color="info"
          onClick={() => handleNavigation("/dashboard")}
          variant={active === "/dashboard" ? "outlined" : "contained"}
          sx={{
            mr: !isMedium ? "1.2rem" : 0,
            color: active === "/dashboard" ? colors.green[200] : "white",
          }}
          size="small"
        >
          {!isMedium && "Dashboard"}
        </Button>
      )}
      {user.name && (
        <Button
          startIcon={<LogoutIcon />}
          onClick={() => {
            logout();
            handleNavigation("/login");
          }}
          color="secondary"
          variant={active === "/logout" ? "outlined" : "contained"}
          sx={{
            color: active === "/logout" ? colors.green[200] : "white",
            mr: !isMedium ? "1rem" : "",
          }}
          size="small"
        >
          {!isMedium && "Logout"}
        </Button>
      )}
      <IconButton
        onClick={toggleColorMode}
        sx={{
          display: !isMobile ? "block" : "none",
        }}
      >
        {theme.palette.mode === "dark" ? <LightModeIcon /> : <BedtimeIcon />}
      </IconButton>
    </Box>
  );

  return isMobile ? (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {user.name && (
        <IconButton onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
      )}
      <IconButton
        onClick={toggleColorMode}
        sx={{
          ml: !isMedium ? "1.2rem" : 0,
          display: isMedium ? "block" : "none",
        }}
      >
        {theme.palette.mode === "dark" ? <LightModeIcon /> : <BedtimeIcon />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {navItems}
      </Menu>
    </Box>
  ) : (
    navItems
  );
};

export default Navbar;
