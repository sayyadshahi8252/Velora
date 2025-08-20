import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./src/config/mongodb.js"
import connectCloudinary from "./src/config/cloudinary.js"
import userRouter from "./src/routes/userRoutes.js"
import productRouter from "./src/routes/productRoutes.js"
import cartRouter from "./src/routes/cartRoute.js"
import orderRouter from "./src/routes/orderRoute.js"


//App config
const app=express()
const port=process.env.PORT || 4000

//middleware
app.use(express.json({limit:"18kb"}))
app.use(cors())



console.log("heelo")
connectDB()
connectCloudinary()

//api endpoint
app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("api working successfully")
})



app.listen(port,"0.0.0.0",()=>{
    console.log(`server running on port ${process.env.PORT}`)
})