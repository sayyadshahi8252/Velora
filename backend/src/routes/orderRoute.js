import express from "express"
import {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus, updatePayment} from '../controllers/orderController.js'
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"

const orderRouter=express.Router()

//admin
orderRouter.post('/list',allOrders)
orderRouter.post('/status',updateStatus)
orderRouter.post("/payment", updatePayment);
// orderRouter.post('/cancel', cancelOrder);
//payment
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)
orderRouter.post('/razorpay',authUser, placeOrderRazorpay)

//userfeature

orderRouter.post('/userorders',authUser, userOrders)

export default orderRouter