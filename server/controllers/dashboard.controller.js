import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";
import CategoryModel from "../models/category.model.js";

// Get comprehensive dashboard statistics
export const getDashboardStatsController = async (request, response) => {
  try {
    const [
      // User statistics
      totalUsers,
      activeUsers,
      verifiedUsers,
      totalAdmins,

      // Product statistics
      totalProducts,
      publishedProducts,
      outOfStockProducts,
      lowStockProducts,

      // Order statistics
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,

      // Category statistics
      totalCategories,

      // Recent activity
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      // Users
      UserModel.countDocuments(),
      UserModel.countDocuments({ status: "Active" }),
      UserModel.countDocuments({ verify_email: true }),
      UserModel.countDocuments({ role: "ADMIN" }),

      // Products
      ProductModel.countDocuments(),
      ProductModel.countDocuments({ publish: true }),
      ProductModel.countDocuments({ stock: 0 }),
      ProductModel.countDocuments({ stock: { $gt: 0, $lt: 10 } }),

      // Orders
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ payment_status: "pending" }),
      OrderModel.countDocuments({ payment_status: "completed" }),
      OrderModel.aggregate([
        { $match: { payment_status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmt" } } },
      ]),

      // Categories
      CategoryModel.countDocuments(),

      // Recent activity
      OrderModel.find()
        .populate("userId", "name email")
        .populate("productId", "name price")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderId payment_status totalAmt createdAt"),
      UserModel.find()
        .select("name email createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calculate growth rates (compared to last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [
      newUsersThisMonth,
      newOrdersThisMonth,
      revenueThisMonth,
    ] = await Promise.all([
      UserModel.countDocuments({ createdAt: { $gte: lastMonth } }),
      OrderModel.countDocuments({ createdAt: { $gte: lastMonth } }),
      OrderModel.aggregate([
        {
          $match: {
            payment_status: "completed",
            createdAt: { $gte: lastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmt" } } },
      ]),
    ]);

    return response.json({
      message: "Dashboard statistics retrieved successfully",
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          admins: totalAdmins,
          newThisMonth: newUsersThisMonth,
        },
        products: {
          total: totalProducts,
          published: publishedProducts,
          outOfStock: outOfStockProducts,
          lowStock: lowStockProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          newThisMonth: newOrdersThisMonth,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: revenueThisMonth[0]?.total || 0,
        },
        categories: {
          total: totalCategories,
        },
        recentActivity: {
          orders: recentOrders,
          users: recentUsers,
        },
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

// Get sales analytics
export const getSalesAnalyticsController = async (request, response) => {
  try {
    const { period = "month" } = request.query;

    let startDate = new Date();
    let groupBy;

    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
    }

    const salesData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          payment_status: "completed",
        },
      },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return response.json({
      message: "Sales analytics retrieved successfully",
      data: salesData,
      period,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

// Get top selling products
export const getTopProductsController = async (request, response) => {
  try {
    const { limit = 10 } = request.query;

    const topProducts = await OrderModel.aggregate([
      { $match: { payment_status: "completed" } },
      {
        $group: {
          _id: "$productId",
          totalSales: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          name: "$product.name",
          image: "$product.image",
          price: "$product.price",
          totalSales: 1,
          orderCount: 1,
        },
      },
    ]);

    return response.json({
      message: "Top products retrieved successfully",
      data: topProducts,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

// Get low stock products
export const getLowStockProductsController = async (request, response) => {
  try {
    const { threshold = 10 } = request.query;

    const lowStockProducts = await ProductModel.find({
      stock: { $gt: 0, $lte: Number(threshold) },
      publish: true,
    })
      .populate("category", "name")
      .select("name image stock price")
      .sort({ stock: 1 });

    return response.json({
      message: "Low stock products retrieved successfully",
      data: lowStockProducts,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

// Get revenue by category
export const getRevenueByCategoryController = async (request, response) => {
  try {
    const revenueByCategory = await OrderModel.aggregate([
      { $match: { payment_status: "completed" } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $unwind: "$product.category" },
      {
        $group: {
          _id: "$product.category",
          totalRevenue: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 1,
          categoryName: "$category.name",
          categoryImage: "$category.image",
          totalRevenue: 1,
          orderCount: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    return response.json({
      message: "Revenue by category retrieved successfully",
      data: revenueByCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};
