
import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, bestseller, sizes } = req.body;

    const image1 = req.files?.image1?.[0] || null;
    const image2 = req.files?.image2?.[0] || null;
    const image3 = req.files?.image3?.[0] || null;
    const image4 = req.files?.image4?.[0] || null;

    const images = [image1, image2, image3, image4].filter(item => item);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subcategory,
      bestseller: bestseller === "true",
      sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes, 
      image: imagesUrl,
      date: Date.now(),
    };

    console.log("📦 Product Data:", productData);

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: "Product added",
      product: productData,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};


const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({})
    res.json({ success: true, data: products  })
  } catch (error) {
    res.json({ success: false })
  }

}

const removeProduct = async (req, res) => {
  try {
    const products = await productModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: "removed" })
  } catch (error) {
    res.json({ success: false })
  }
}
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({ success: true, product })
  } catch (error) {
    res.json({ success: false })
  }
}

export { addProduct, listProduct, removeProduct, singleProduct }