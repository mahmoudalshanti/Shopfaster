import { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { motion } from "framer-motion";
import {
  AttachMoneyOutlined,
  KitchenOutlined,
  Person2Outlined,
  ShoppingCartOutlined,
  SvgIconComponent,
} from "@mui/icons-material";
import { Grid, useTheme, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Stack } from "@mui/system";
import { SkeletonAnalytics } from "./Skeletons";
import { useUser } from "../contexts/UserProvider";

interface AnalyticsData {
  users: number;
  products: number;
  totalSales: number;
  totalRevenue: number;
}

interface DailySalesData {
  date: string;
  sales: number;
  revenue: number;
}

interface AnalyticsCardProps {
  title: string;
  total: string;
  icon: SvgIconComponent;
}

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailySalesData, setDailySalesData] = useState<DailySalesData[]>([]);
  const { user } = useUser();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.name) fetchAnalyticsData();
  }, []);

  const cards: AnalyticsCardProps[] = [
    {
      title: "Total Users",
      total: analyticsData.users.toLocaleString(),
      icon: Person2Outlined,
    },
    {
      title: "Total Products",
      total: analyticsData.products.toLocaleString(),
      icon: KitchenOutlined,
    },
    {
      title: "Total Sales",
      total: analyticsData.totalSales.toLocaleString(),
      icon: ShoppingCartOutlined,
    },
    {
      title: "Total Revenue",
      total: analyticsData.totalRevenue.toLocaleString(),
      icon: AttachMoneyOutlined,
    },
  ];

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ height: "40vh" }}
      >
        <SkeletonAnalytics />
      </motion.div>
    );

  if (!dailySalesData || dailySalesData.length === 0) {
    return (
      <Typography
        fontSize={"1.2rem"}
        textAlign={"center"}
        height={dailySalesData.length === 0 ? "100vh" : ""}
      >
        No data available for the chart.
      </Typography>
    );
  }

  return (
    <Stack height={dailySalesData.length === 0 ? "40vh" : ""}>
      <Grid container justifyContent="center" spacing={2}>
        {cards.map((card) => (
          <Grid item key={card.title} xs={12} sm={6} md={4} lg={3}>
            <AnalyticsCard {...card} />
          </Grid>
        ))}
      </Grid>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ marginTop: "2rem" }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={dailySalesData}
            className={
              theme.palette.mode === "dark"
                ? "Paper-overlay-Dark"
                : "Paper-overlay-Light"
            }
          >
            <CartesianGrid strokeDasharray="5 3" />
            <XAxis
              dataKey="date"
              stroke={mode === "dark" ? "#D1D5DB" : "#777"}
            />
            <YAxis
              yAxisId="left"
              stroke={mode === "dark" ? "#D1D5DB" : "#777"}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={mode === "dark" ? "#D1D5DB" : "#777"}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </Stack>
  );
};

export default AnalyticsTab;
