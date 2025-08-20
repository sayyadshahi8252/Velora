import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../App";
import uploadimage from "../assets/uploadimage.png";
import styles from "./Add.module.css";

export default function Add({ token }) {
    const [ images, setImages ] = useState([ null, null, null, null ]);
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ category, setCategory ] = useState("MEN");
    const [ subcategory, setSubcategory ] = useState("Topwear");
    const [ price, setPrice ] = useState("");
    const [ sizes, setSizes ] = useState([]);
    const [ bestseller, setBestseller ] = useState(false);

    const handleSizeToggle = (size) => {
        if (sizes.includes(size)) {
            setSizes(sizes.filter((s) => s !== size));
        } else {
            setSizes([ ...sizes, size ]);
        }
    };

    const handleImageChange = (file, index) => {
        const updated = [ ...images ];
        updated[ index ] = file;
        setImages(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("subcategory", subcategory);
        formData.append("bestseller", bestseller.toString());
        formData.append("sizes", JSON.stringify(sizes));

        if (images[ 0 ]) formData.append("image1", images[ 0 ]);
        if (images[ 1 ]) formData.append("image2", images[ 1 ]);
        if (images[ 2 ]) formData.append("image3", images[ 2 ]);
        if (images[ 3 ]) formData.append("image4", images[ 3 ]);

        try {
            const response = await axios.post(
                `${backendUrl}/api/product/add`,
                formData,
                { headers: { token: token } }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Product added successfully!");
                setName("");
                setDescription("");
                setPrice("");
                setCategory("MEN");
                setSubcategory("Topwear");
                setSizes([]);
                setBestseller(false);
                setImages([ null, null, null, null ]);
            } else {
                toast.error(response.data.message || "Failed to add product!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong!");
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                    <p>Upload Images</p>
                    <div className={styles.imageUpload}>
                        {[ 0, 1, 2, 3 ].map((index) => (
                            <label key={index}>
                                <img
                                    src={images[ index ] ? URL.createObjectURL(images[ index ]) : uploadimage}
                                    alt="Upload"
                                />
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => handleImageChange(e.target.files[ 0 ], index)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <p>Product Name</p>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Enter product name"
                        required
                        className={styles.input}
                    />
                </div>

                <div>
                    <p>Product Description</p>
                    <textarea
                        placeholder="Enter product description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className={styles.textarea}
                    ></textarea>
                </div>

                <div>
                    <p>Product Category</p>
                    <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="MEN">Men</option>
                        <option value="WOMEN">Women</option>
                        <option value="KIDS">Kids</option>
                    </select>
                </div>

                <div>
                    <p>Subcategory</p>
                    <select className={styles.select} value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                        <option value="Topwear">Topwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Winterwear">Winterwear</option>
                        <option value="T-Shirts">T-Shirts</option>
                        <option value="Shirts">Shirts</option>
                        <option value="Pants">Pants</option>
                        <option value="sweatshirt">Sweatshirt</option>
                    </select>
                </div>
                <div>
                    <p>Product Price</p>
                    <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div>
                    <p>Product Size</p>
                    <div className={styles.sizeOptions}>
                        {[ "S", "M", "L", "XL", "XXL" ].map((size) => (
                            <div
                                key={size}
                                onClick={() => handleSizeToggle(size)}
                                style={{
                                    backgroundColor: sizes.includes(size) ? "#d4a5a5" : "transparent",
                                    color: sizes.includes(size) ? "#fff" : "#000",
                                    borderColor: sizes.includes(size) ? "#d4a5a5" : "#ccc",
                                    cursor: "pointer",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                }}
                            >
                                <p>{size}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.checkboxGroup}>
                    <input type="checkbox" id="bestseller" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} />
                    <label htmlFor="bestseller">Bestseller</label>
                </div>

               
                <button type="submit" className={styles.submitBtn}>
                    Add Product
                </button>
            </form>
        </div>
    );
}
