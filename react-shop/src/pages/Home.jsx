import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import api from "../services/api";

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setAllProducts(response.data);
        setProducts(response.data);
      } catch (err) {
        console.error("Error getting all products: ", err);
      }
    };

    fetchProducts();
  }, []);

  function onSearch(event) {
    const searchTerm = event.target.value.trim().toLowerCase();
    console.log("search: ", searchTerm);

    // clear previous timer before setting new one
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // add debounce delay (e.g. 400ms)
    searchTimeout.current = setTimeout(() => {
      if (searchTerm === "") {
        setProducts(allProducts);
      } else {
        const filteredProducts = allProducts.filter((product) =>
          product.title.toLowerCase().includes(searchTerm)
        );
        setProducts(filteredProducts);
      }
    }, 400);
  }

  function onSortPriceLow() {
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    setProducts(sortedProducts);
  }

  function onSortPriceHigh() {
    const sortedProducts = [...products].sort((a, b) => b.price - a.price);
    setProducts(sortedProducts);
  }

  function onSortAscend() {
    const sortedProducts = [...products].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setProducts(sortedProducts);
  }

  function onSortDescend() {
    const sortedProducts = [...products].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
    setProducts(sortedProducts);
  }

  return (
    <div className="column d-flex flex-column align-items-center">
      <Form className="d-flex gap-3 w-50 m-4">
        <Form.Control
          onChange={onSearch}
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic"
            className="sort no-arrow"
          >
            <span className="material-symbols-outlined d-flex align-items-center">
              sort
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={onSortAscend}>
              Ascending Order
            </Dropdown.Item>
            <Dropdown.Item onClick={onSortDescend}>
              Descending Order
            </Dropdown.Item>
            <Dropdown.Item onClick={onSortPriceHigh}>
              Highest Price
            </Dropdown.Item>
            <Dropdown.Item onClick={onSortPriceLow}>Lowest Price</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Form>
      <div className="row w-100 px-5" style={{ margin: 0 }}>
        {products.map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <Link to={`/product/${product.id}`} className="card h-100 p-1 p-md-2 p-lg-4 text-decoration-none">
              <img
                src={product.image}
                className="card-img-top p-4"
                style={{ height: "200px", objectFit: "contain" }}
                alt={product.title}
              />
              <div className="card-body">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{product.title}</Tooltip>}
                >
                  <h5
                    className="card-title truncate-text"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                  >
                    {product.title}
                  </h5>
                </OverlayTrigger>
                <p className="card-text">${product.price}</p>
                {product.stock === 0 ? (
                  <button className="btn btn-secondary w-100" disabled>
                    Out of Stock
                  </button>
                ) : (
                  <button className="btn btn-primary w-100">Add to Cart</button>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div>
          <h2>No search results found</h2>
        </div>
      )}
    </div>
  );
}

export default Home;
