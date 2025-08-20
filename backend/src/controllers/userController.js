import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const createToken = (id, name, email) => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "user not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {

            const token = createToken(user._id, user.name, user.email);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "invalid credentails" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password < 6) {
            return res.json({ success: false, message: "Please enter a strong password " });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "not vallid" })
    }
}
// const getProfile = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.user.id).select("name email");
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
//     res.json({ success: true, user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
export { loginUser, registerUser, adminLogin };
