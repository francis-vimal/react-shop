import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Form } from "react-bootstrap";
import ToolTip from "../components/ToolTip";
import api from "../services/api";

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const searchTimeout = useRef(null);
  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = (await api.get("/products")).data;
        const categoryObjects = [
          ...new Set(products.map((product) => product.category)),
        ].map((category) => ({
          name:
            category === "men's clothing"
              ? "Men"
              : category === "women's clothing"
              ? "Women"
              : category === "jewelery"
              ? "Jewelry"
              : category.replace(/^(\w)/, (match) => match.toUpperCase()),
          categoryName: category,
        }));
        setAllProducts(products);
        setProducts(products);
        setCategories(categoryObjects);
      } catch (err) {
        console.error("Error getting all products: ", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get(`/carts/${userId}`);
        setCart(response.data.products);
      } catch (err) {
        console.error("Error getting cart: ", err);
      }
    };
    fetchCart();
  }, []);

  function onSearch(event) {
    const searchTerm = event.target.value.trim().toLowerCase();
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

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

  function onSort(type) {
    const sortedProducts = [...products].sort((a, b) => {
      switch (type) {
        case "priceLow":
          return a.price - b.price;
        case "priceHigh":
          return b.price - a.price;
        case "ascend":
          return a.title.localeCompare(b.title);
        case "descend":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  
    setProducts(sortedProducts);
  }

  function filterProducts(category) {
    setSelectedCategory(category);
    const filterProducts = allProducts.filter((product) => {
      return product.category === category;
    });
    setProducts(filterProducts);
  }

  function onResetCategory() {
    setSelectedCategory("");
    setProducts(allProducts);
  }

  function addCart(id) {
    setCart((prevCart) => [...prevCart, { productId: id, quantity: 1 }]);
  }

  useEffect(() => {
    async function updateCart() {
      try {
        const cartDetail = { userId: userId, products: cart };
        await api.put(`/carts/${userId}`, cartDetail);
      } catch (err) {
        console.error(err);
      }
    }

    updateCart();
  }, [cart]);

  const changeCount = (id, action) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.productId !== id) return item;
        if (action === "decrease" && item.quantity === 1) {
          return item;
        }
        return {
          ...item,
          quantity:
            action === "increase" ? item.quantity + 1 : item.quantity - 1,
        };
      });

      // check if cart actually changed
      if (JSON.stringify(newCart) === JSON.stringify(prevCart)) return prevCart;
      return newCart;
    });
  };

  return (
    <div className="column d-flex flex-column align-items-center">
      <Form
        onSubmit={(e) => e.preventDefault()}
        className="d-flex gap-3 w-50 m-4"
      >
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
            <Dropdown.Item onClick={() => onSort("ascend")}>
              Ascending Order
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onSort("descend")}>
              Descending Order
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onSort("priceHigh")}>
              Highest Price
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onSort("priceLow")}>
              Lowest Price
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Form>
      <div className="d-flex gap-3 mb-4">
        {allCategories.length > 0 &&
          allCategories.map((category) => (
            <h6
              key={category.categoryName}
              onClick={() => filterProducts(category.categoryName)}
              role="button"
              className={`categoryName border border-primary px-3 py-2 ${
                category.categoryName === selectedCategory ? "active" : ""
              }`}
            >
              {category.name}
            </h6>
          ))}
          {selectedCategory ? <div role="button" onClick={() => onResetCategory("")}>
            <span className="material-symbols-outlined d-flex align-items-center p-2 categoryReset">replay</span>
          </div> : null} 
      </div>
      <div className="row w-100 px-5" style={{ margin: 0 }}>
        {products.map((product) => (
          <div className="col-lg-3 col-sm-6 col-md-4 mb-4 fadeIn" key={product.id}>
            <div className="card p-4">
              <Link
                to={`/product/${product.id}`}
                className=" h-100 text-decoration-none"
              >
                <img
                  src={product.image}
                  className="card-img-top mb-3"
                  style={{ height: "200px", objectFit: "contain" }}
                  alt={product.title}
                />
                <div className="card-body p-0 mb-3">
                  <ToolTip product={product.title} />
                  <p className="card-text">${product.price}</p>
                </div>
              </Link>
              {product.stock === 0 ? (
                <button className="btn btn-secondary w-100" disabled>
                  Out of Stock
                </button>
              ) : !cart.some((cart) => cart.productId === product.id) ? (
                <button
                  onClick={() => addCart(product.id)}
                  className="btn btn-primary w-100"
                >
                  Add to Cart
                </button>
              ) : (
                <>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="quantityName">Quantity</span>
                    <div className="d-flex align-items-center">
                      <span
                        className="quantityIcon material-symbols-outlined"
                        onClick={() => changeCount(product.id, "decrease")}
                      >
                        remove
                      </span>
                      <span className="mx-2">
                        {cart.find((item) => item.productId === product.id)
                          ?.quantity || 0}
                      </span>
                      <span
                        className="quantityIcon material-symbols-outlined"
                        onClick={() => changeCount(product.id, "increase")}
                      >
                        add
                      </span>
                    </div>
                  </div>
                  <hr className="my-1" />
                  <div className="subtotal d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>
                      $
                      {(
                        (cart.find((item) => item.productId === product.id)
                          ?.quantity || 0) * product.price
                      ).toFixed(2)}
                    </span>
                  </div>
                  <button className="btn btn-success w-100" disabled>
                    ✅ Added to Cart
                  </button>
                </>
              )}
            </div>
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
