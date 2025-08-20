import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

// const cancelOrder = async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         const userId = req.user.id; 

//         const order = await orderModel.findOne({ _id: orderId, userId: userId });

//         if (!order) {
//             return res.json({ success: false, message: "Order not found or not owned by user" });
//         }


//         if (order.status === "Out for Delivery" || order.status === "Delivered") {
//              return res.json({ success: false, message: "Cannot cancel an order that is already in transit or delivered" });
//         }

//         order.status = "Canceled";
//         await order.save();

//         res.json({ success: true, message: "Order canceled successfully" });
//     } catch (error) {
//         console.error("Error canceling order:", error);
//         res.json({ success: false, message: "Error" });
//     }
// };


const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const placeOrderStripe = async (req, res) => {

}
const placeOrderRazorpay = async (req, res) => {

}

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("userId", "name email") 
      .sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch all orders" });
  }
};

const userOrders = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};



const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};
const updatePayment = async (req, res) => {
  const { orderId, payment } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { payment });
    res.json({ success: true, message: "Payment updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating payment" });
  }
};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, updatePayment }