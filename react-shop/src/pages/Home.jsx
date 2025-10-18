import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Tooltip } from "bootstrap";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error getting all products: ", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(
      (el) => new Tooltip(el)
    );

    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose());
    };
  }, [products]);

  return (
    <div className="row p-5" style={{ margin: 0 }}>
      {products.map((product) => (
        <div className="col-md-3 mb-4" key={product.id}>
          <div className="card h-100">
            <img
              src={product.image}
              className="card-img-top p-4"
              style={{ height: "200px", objectFit: "contain" }}
              alt={product.title}
            />
            <div className="card-body">
              <h5
                title={product.title}
                className="card-title truncate-text"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                {product.title}
              </h5>
              <p className="card-text">${product.price}</p>
              {product.stock === 0 ? (
                <button className="btn btn-secondary w-100" disabled>
                  Out of Stock
                </button>
              ) : (
                <button className="btn btn-primary w-100">Add to Cart</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
