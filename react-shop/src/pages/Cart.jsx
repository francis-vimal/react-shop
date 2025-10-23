import React, { useState, useEffect } from "react";
import api from "../services/api";
import ToolTip from "../components/ToolTip";

function Cart() {
  const [carts, setCarts] = useState([]);
  const [products, setProducts] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [selectedAddress, setSelectedAddress] = useState({});

  useEffect(() => {
    const getAllCarts = async () => {
      try {
        const response = await api.get("/carts");
        setUserDetail(JSON.parse(localStorage.getItem("user")));
        console.log(userDetail);
        const cartProducts = response.data.find(
          (res) => res.userId == parseInt(userDetail.id)
        );
        setCarts(cartProducts?.products);
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

  const handleAddressSelect = (id) => {
    if (id > 0) setSelectedAddress(userDetail.address);
    console.log(selectedAddress);
  };

  return (
    <div className="container row m-auto">
      {/* 🛒 Cart Summary */}
      <div className="col-md-5 col-lg-4 pt-4 w-100">
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
                className="list-group-item d-flex justify-content-between lh-sm flex-sm-column"
              >
                <img
                  src={product.image}
                  className="p-3 me-3 me-sm-0"
                  style={{ height: "100px", objectFit: "contain" }}
                  alt={product.title}
                />
                <div className="truncate-text me-3 me-sm-0 d-flex gap-3 flex-column justify-content-center">
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

      {/* 💳 Billing Form */}
      <div className="col-md-7 col-lg-8 pt-4">
        <h4 className="mb-3">Billing address</h4>
        <div className="col-12 mb-3">
          <label htmlFor="savedAddress" className="form-label">
            Select saved address
          </label>
          <select
            id="savedAddress"
            className="form-select"
            onChange={(e) => handleAddressSelect(e.target.value)}
          >
            <option value="0">Select address</option>
            {userDetail.address && (
              <option value={userDetail.id}>
                {userDetail.address.number} {userDetail.address.street},
                {userDetail.address.city}, {userDetail.address.zipcode}
              </option>
            )}
          </select>
        </div>
        <form className="needs-validation" noValidate>
          <div className="row g-3">
            <div className="col-sm-6">
              <label htmlFor="firstname" className="form-label">
                First name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={selectedAddress?.name?.firstname || ""}
                required
              />
              <div className="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div className="col-sm-6">
              <label htmlFor="lastname" className="form-label">
                Last name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={selectedAddress?.name?.lastname || ""}
                required
              />
              <div className="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text">@</span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={selectedAddress.username || ""}
                  required
                />
                <div className="invalid-feedback">
                  Your username is required.
                </div>
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email <span className="text-body-secondary">(Optional)</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={selectedAddress.email || ""}
                placeholder="you@example.com"
              />
              <div className="invalid-feedback">
                Please enter a valid email address.
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="1234 Main St"
                required
              />
              <div className="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="address2" className="form-label">
                Address 2{" "}
                <span className="text-body-secondary">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="address2"
                placeholder="Apartment or suite"
              />
            </div>

            <div className="col-md-5">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <select className="form-select" id="country" required>
                <option value="">Choose...</option>
                <option>United States</option>
              </select>
              <div className="invalid-feedback">
                Please select a valid country.
              </div>
            </div>

            <div className="col-md-4">
              <label htmlFor="state" className="form-label">
                State
              </label>
              <select className="form-select" id="state" required>
                <option value="">Choose...</option>
                <option>California</option>
              </select>
              <div className="invalid-feedback">
                Please provide a valid state.
              </div>
            </div>

            <div className="col-md-3">
              <label htmlFor="zip" className="form-label">
                Zip
              </label>
              <input type="text" className="form-control" id="zip" required />
              <div className="invalid-feedback">Zip code required.</div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="same-address"
            />
            <label className="form-check-label" htmlFor="same-address">
              Shipping address is the same as my billing address
            </label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="save-info"
            />
            <label className="form-check-label" htmlFor="save-info">
              Save this information for next time
            </label>
          </div>

          <hr className="my-4" />

          <h4 className="mb-3">Payment</h4>

          <div className="my-3">
            <div className="form-check">
              <input
                id="credit"
                name="paymentMethod"
                type="radio"
                className="form-check-input"
                defaultChecked
                required
              />
              <label className="form-check-label" htmlFor="credit">
                Credit card
              </label>
            </div>

            <div className="form-check">
              <input
                id="debit"
                name="paymentMethod"
                type="radio"
                className="form-check-input"
                required
              />
              <label className="form-check-label" htmlFor="debit">
                Debit card
              </label>
            </div>

            <div className="form-check">
              <input
                id="paypal"
                name="paymentMethod"
                type="radio"
                className="form-check-input"
                required
              />
              <label className="form-check-label" htmlFor="paypal">
                PayPal
              </label>
            </div>
          </div>

          <div className="row gy-3">
            <div className="col-md-6">
              <label htmlFor="cc-name" className="form-label">
                Name on card
              </label>
              <input
                type="text"
                className="form-control"
                id="cc-name"
                required
              />
              <small className="text-body-secondary">
                Full name as displayed on card
              </small>
              <div className="invalid-feedback">Name on card is required</div>
            </div>

            <div className="col-md-6">
              <label htmlFor="cc-number" className="form-label">
                Credit card number
              </label>
              <input
                type="text"
                className="form-control"
                id="cc-number"
                required
              />
              <div className="invalid-feedback">
                Credit card number is required
              </div>
            </div>

            <div className="col-md-3">
              <label htmlFor="cc-expiration" className="form-label">
                Expiration
              </label>
              <input
                type="text"
                className="form-control"
                id="cc-expiration"
                required
              />
              <div className="invalid-feedback">Expiration date required</div>
            </div>

            <div className="col-md-3">
              <label htmlFor="cc-cvv" className="form-label">
                CVV
              </label>
              <input
                type="text"
                className="form-control"
                id="cc-cvv"
                required
              />
              <div className="invalid-feedback">Security code required</div>
            </div>
          </div>

          <hr className="my-4" />

          <button className="w-100 btn btn-primary btn-lg" type="submit">
            Continue to checkout
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cart;
