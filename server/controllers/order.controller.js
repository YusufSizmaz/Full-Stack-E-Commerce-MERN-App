import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

// Create new order
export const createOrderController = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      productId,
      product_details,
      delivery_address,
      subTotalAmt,
      totalAmt,
      paymentId,
      payment_status,
    } = request.body;

    if (!productId || !delivery_address || !totalAmt) {
      return response.status(400).json({
        message: "Product, delivery address, and total amount are required",
        error: true,
        success: false,
      });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = new OrderModel({
      userId,
      orderId,
      productId,
      product_details,
      delivery_address,
      subTotalAmt,
      totalAmt,
      paymentId,
      payment_status: payment_status || "pending",
    });

    const savedOrder = await order.save();

    // Add order to user's order history
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orderHistory: savedOrder._id },
    });

    return response.json({
      message: "Order created successfully",
      data: savedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get all orders (Admin)
export const getAllOrdersController = async (request, response) => {
  try {
    const { page = 1, limit = 10, status, search } = request.query;

    const query = {};

    // Filter by payment status
    if (status) {
      query.payment_status = status;
    }

    // Search by order ID
    if (search) {
      query.orderId = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, totalCount] = await Promise.all([
      OrderModel.find(query)
        .populate("userId", "name email mobile")
        .populate("productId", "name price image")
        .populate("delivery_address")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      OrderModel.countDocuments(query),
    ]);

    return response.json({
      message: "All orders retrieved successfully",
      data: orders,
      totalCount,
      totalPages: Math.ceil(totalCount / Number(limit)),
      currentPage: Number(page),
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get user orders
export const getUserOrdersController = async (request, response) => {
  try {
    const userId = request.userId;
    const { page = 1, limit = 10 } = request.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, totalCount] = await Promise.all([
      OrderModel.find({ userId })
        .populate("productId", "name price image")
        .populate("delivery_address")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      OrderModel.countDocuments({ userId }),
    ]);

    return response.json({
      message: "User orders retrieved successfully",
      data: orders,
      totalCount,
      totalPages: Math.ceil(totalCount / Number(limit)),
      currentPage: Number(page),
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get single order details
export const getOrderDetailsController = async (request, response) => {
  try {
    const { orderId } = request.params;
    const userId = request.userId;

    const order = await OrderModel.findOne({ orderId })
      .populate("userId", "name email mobile")
      .populate("productId", "name price image description")
      .populate("delivery_address");

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    // Check if user has permission to view this order
    const user = await UserModel.findById(userId);
    if (user.role !== "ADMIN" && order.userId._id.toString() !== userId) {
      return response.status(403).json({
        message: "Access denied",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Order details retrieved successfully",
      data: order,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Update order payment status (Admin)
export const updateOrderStatusController = async (request, response) => {
  try {
    const { orderId, payment_status, paymentId, invoice_receipt } = request.body;

    if (!orderId || !payment_status) {
      return response.status(400).json({
        message: "Order ID and payment status are required",
        error: true,
        success: false,
      });
    }

    const updateData = { payment_status };
    if (paymentId) updateData.paymentId = paymentId;
    if (invoice_receipt) updateData.invoice_receipt = invoice_receipt;

    const order = await OrderModel.findOneAndUpdate(
      { orderId },
      updateData,
      { new: true }
    ).populate("userId", "name email")
      .populate("productId", "name price");

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Order status updated successfully",
      data: order,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Delete order (Admin)
export const deleteOrderController = async (request, response) => {
  try {
    const { orderId } = request.body;

    if (!orderId) {
      return response.status(400).json({
        message: "Order ID is required",
        error: true,
        success: false,
      });
    }

    const order = await OrderModel.findOneAndDelete({ orderId });

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    // Remove order from user's order history
    await UserModel.findByIdAndUpdate(order.userId, {
      $pull: { orderHistory: order._id },
    });

    return response.json({
      message: "Order deleted successfully",
      data: order,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get order statistics (Admin)
export const getOrderStatsController = async (request, response) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
    ] = await Promise.all([
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ payment_status: "pending" }),
      OrderModel.countDocuments({ payment_status: "completed" }),
      OrderModel.aggregate([
        { $match: { payment_status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmt" } } },
      ]),
    ]);

    return response.json({
      message: "Order statistics retrieved successfully",
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get recent orders (Admin)
export const getRecentOrdersController = async (request, response) => {
  try {
    const { limit = 10 } = request.query;

    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("productId", "name price image")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return response.json({
      message: "Recent orders retrieved successfully",
      data: orders,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
