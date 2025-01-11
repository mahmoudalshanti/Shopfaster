import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";

export const getAnalyticsData = async (): Promise<{
  users: number;
  products: number;
  totalRevenue: number;
  totalSales: number;
}> => {
  const totalUsers = await User.countDocuments(); // total users
  const totalProducts = await Product.countDocuments(); // total products

  // total sales and revenue
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // all documnets are grouped into single documents
        totalSales: { $sum: 1 }, // count of all documents
        totalRevenue: { $sum: "$totalAmount" }, // sum of all totalAmount fields
      },
    },
  ]); // returns array of single object

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (
  startDate: Date,
  endDate: Date
): Promise<
  {
    date: string;
    revenue: number;
    sales: number;
  }[]
> => {
  try {
    // how many sales and revenue generated each day
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          // get all orders between  the days of sales
          createdAt: {
            // during week
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          // then make group for each day for sales during week
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // example of dailySalesData
    // [
    // 	{
    // 		_id: "2024-08-18",
    // 		sales: 12,
    // 		revenue: 1450.75
    // 	},
    // 		_id: "2024-08-19",
    // 		sales: 2,
    // 		revenue: 50.75
    // 	},
    // ]

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
