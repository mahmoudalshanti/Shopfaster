import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Loading from "../../components/Loading";
import useGetAllOrders, { OrderProperty } from "../../hooks/useGetAllOrders";
import useUpdateAllOrders from "../../hooks/useUpdateOrder";
import { motion } from "framer-motion";
import { useUser } from "../../contexts/UserProvider";
import { ProductProperty } from "../../interfaces/Product";

function Orders() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isLoading, getOrders } = useGetAllOrders();
  const [orders, setOrders] = useState<OrderProperty[] | undefined>(undefined);
  const { updateOrders } = useUpdateAllOrders();

  const orderStatus = [
    "pending",
    "shipped",
    "delivered",
    "canceled",
    "processing",
  ];

  const handleStatusChange = async (newStatus: string, id: string) => {
    if (!user.name) return;
    try {
      await updateOrders(newStatus, id);
      setOrders((prevOrders) =>
        prevOrders?.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  const { user } = useUser();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (user?.name) fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height={"40vh"}>
        <Loading size="medium" />
      </Stack>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "products",
      headerName: "Order Details",
      width: 300,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            maxHeight: 100,
            overflowY: "auto",
            padding: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "#f9f9f9",
            borderRadius: "4px",
          }}
        >
          {params.value.map((product: ProductProperty) => (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              key={product._id}
              mb={1}
            >
              <Box
                width="50px"
                height="50px"
                borderRadius="8px%"
                overflow="hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Stack>
                <Typography>{product.name}</Typography>
                <Typography>Quantity: {product.quantity}</Typography>
                <Typography>Price: {product.price}$</Typography>
              </Stack>
            </Stack>
          ))}
        </Box>
      ),
    },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            maxHeight: 100,
            overflowY: "auto",
            padding: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "#f9f9f9",
            borderRadius: "4px",
          }}
        >
          <Typography>Name: {params.value.name}</Typography>
          <Typography>Email: {params.value.email}</Typography>
        </Box>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography lineHeight={"4"} textAlign={"center"}>
          {params.value}$
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id={`status-label-${params.id}`}>Status</InputLabel>
          <Select
            sx={{ height: "50px" }}
            labelId={`status-label-${params.id}`}
            id={`status-select-${params.id}`}
            value={params.value}
            label="Status"
            fullWidth
            onChange={(e) =>
              handleStatusChange(e.target.value as string, params.row.id)
            }
          >
            {orderStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "track",
      headerName: "Track",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography lineHeight={"3.5"}>{params.value}</Typography>
      ),
    },
  ];

  const rows = orders?.map((order) => ({
    id: order._id,
    products: order.products,
    user: order.user,
    totalAmount: order.totalAmount,
    status: order.status,
    track: order.track,
  })) || [
    {
      id: "No Id",
      products: [],
      status: "pending",
      totalAmount: "0",
      track: "ORD-00000000",
      user: {},
    },
  ];

  return (
    <Stack width={isMobile ? "90%" : "80%"} margin="0 auto" mt={3}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            height: 600,
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
            },
          }}
        >
          <DataGrid
            getRowHeight={() => 100}
            rows={rows}
            columns={columns}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
            }}
            rowHeight={38}
            disableRowSelectionOnClick
          />
        </Box>
      </motion.div>
    </Stack>
  );
}

export default Orders;
