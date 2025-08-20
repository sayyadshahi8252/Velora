import jwt from "jsonwebtoken"

const adminAuth=async(req,res,next)=>{
    try {
       const token = req.headers.token; 
        if(!token){
            return res.json({success:false,message:"not "})
        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        if(token_decode!==process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
             return res.json({success:false,message:"not authorized"})
        }
        next()

    } catch (error) {
        console.log(error,"error")
    }
}
export default  adminAuth;