import React, { useState, useEffect } from "react";
import ToolTip from "../components/ToolTip";
import api from "../services/api";
import { useAppContext } from "../context/Appcontext";

function CartCard() {
  const { carts, setCarts, userDetail, setUserDetail  } = useAppContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllCarts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUserDetail(user);
  
        const response = await api.get("/carts");
        const cartProducts = response.data.find(
          (res) => res.userId == parseInt(user.id)
        );
        setCarts(cartProducts?.products || []);
      } catch (err) {
        console.error("Error fetching carts: ", err);
      }
    };
    getAllCarts();
  }, []);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await api.get("/products");
        const products = carts?.flatMap((cartProduct) =>
          response.data.filter(
            (product) => product.id === cartProduct.productId
          )
        );
        setProducts(products);
      } catch (err) {
        console.error("Error fetching products: ", err);
      }
    };
    getAllProducts();
  }, [carts]);
  return (
    <div className="pt-4">
      <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-primary">Your cart</span>
        <span className="badge bg-primary rounded-pill">
          {products?.length ?? 0}
        </span>
      </h4>

      <ul className="list-group mb-3">
        {products?.length ? (
          products.map((product) => (
            <li
              key={product.id}
              className="list-group-item d-flex justify-content-between lh-sm flex-sm-column fadeIn"
            >
              <img
                src={product.image}
                className="p-3 me-3 me-sm-0"
                style={{ height: "100px", objectFit: "contain" }}
                alt={product.title}
              />
              <div className="truncate-text me-3 me-sm-0 d-flex gap-3 flex-column justify-content-center text-center">
                <ToolTip product={product.title} />
                <small className="text-body-secondary truncate-text">
                  {product.description}
                </small>
              </div>
              <span className="text-body-secondary m-auto my-sm-3">
                ${product.price}
              </span>
            </li>
          ))
        ) : (
          <li className="list-group-item">
            <h3 className="text-center">No products added to the cart</h3>
          </li>
        )}
        <li className="list-group-item d-flex justify-content-end gap-4 justify-content-sm-center">
          <span>Total (USD)</span>
          <strong>
            $
            {products
              ?.reduce((total, product) => total + product.price, 0)
              .toFixed(2)}
          </strong>
        </li>
      </ul>
    </div>
  );
}

export default CartCard;
