import OrderModel from "../models/order.model.js";

export const getOrdersController = async (request, response) => {
  try {
    const userId = request.userId; // from auth middleware

    if (!userId) {
      return response.status(400).json({
        message: "User ID not found",
        error: true,
        success: false,
      });
    }

    const orders = await OrderModel.find({ userId: userId })
      .populate("productId")
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return response.json({
      message: "Orders fetched successfully",
      data: orders,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

