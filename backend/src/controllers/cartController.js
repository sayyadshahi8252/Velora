// cartController.js
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId; // set by auth middleware

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[ itemId ]) {
      if (cartData[ itemId ][ size ]) {
        cartData[ itemId ][ size ] += 1;
      } else {
        cartData[ itemId ][ size ] = 1;
      }
    } else {
      cartData[ itemId ] = { [ size ]: 1 };
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not add to cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId; // set by auth middleware

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (quantity <= 0) {
      if (cartData[ itemId ] && cartData[ itemId ][ size ] !== undefined) {
        delete cartData[ itemId ][ size ];
      }
      if (cartData[ itemId ] && Object.keys(cartData[ itemId ]).length === 0) {
        delete cartData[ itemId ];
      }
    } else {
      if (!cartData[ itemId ]) cartData[ itemId ] = {};
      cartData[ itemId ][ size ] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const userId = req.userId; 

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};
