import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StarRating from "./StarRating";
import api from "../services/api";

function ProductDetails() {
  const productID = useParams().id;
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productID}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [productID]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ backgroundColor: "white" }}>
      <div className="row">
        {/* Left Column: Images */}
        <div className="d-flex col-md-6 mb-4 justify-content-center fadeIn">
          <img
            src={selectedImage}
            alt={product.title}
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>

        {/* Right Column: Details */}
        <div className="col-md-6">
          <h2 className="mb-3">{product.title}</h2>

          <div className="mb-3">
            <span className="h4 me-2">${product.price}</span>
          </div>

          <StarRating
            rating={product.rating.rate}
            count={product.rating.count}
          />

          <p className="mb-4">{product.description}</p>

          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="form-label">
              Quantity:
            </label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={quantity}
              min="1"
              style={{ width: "80px" }}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          {/* Buttons */}
          <button
            className="btn btn-primary btn-lg mb-3 me-2"
            disabled={product.stock === 0}
          >
            <i className="bi bi-cart-plus"></i> Add to Cart
          </button>
          <button
            className="btn btn-outline-secondary btn-lg mb-3"
            disabled={product.stock === 0}
          >
            <i className="bi bi-heart"></i> Add to Wishlist
          </button>

          {/* Features */}
          {product.features && (
            <div className="mt-4">
              <h5>Key Features:</h5>
              <ul>
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
