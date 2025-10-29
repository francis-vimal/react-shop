import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CartCard from "../components/CartCard";
import api from "../services/api";

function Cart() {
  const [carts, setCarts] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string().required('Zip code is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
    ccName: Yup.string().when('paymentMethod', {
      is: (paymentMethod) => paymentMethod === 'credit' || paymentMethod === 'debit',
      then: (schema) => schema.required('Name on card is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    ccNumber: Yup.string().when('paymentMethod', {
      is: (paymentMethod) => paymentMethod === 'credit' || paymentMethod === 'debit',
      then: (schema) => schema.required('Credit card number is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    ccExpiration: Yup.string().when('paymentMethod', {
      is: (paymentMethod) => paymentMethod === 'credit' || paymentMethod === 'debit',
      then: (schema) => schema.required('Expiration date is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    ccCvv: Yup.string().when('paymentMethod', {
      is: (paymentMethod) => paymentMethod === 'credit' || paymentMethod === 'debit',
      then: (schema) => schema.required('CVV is required'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      address: '',
      address2: '',
      country: '',
      state: '',
      zip: '',
      sameAddress: false,
      saveInfo: false,
      paymentMethod: 'credit',
      ccName: '',
      ccNumber: '',
      ccExpiration: '',
      ccCvv: ''
    },
    validationSchema,
    onSubmit : async (formData) => {
      if (!formik.isValid) {
        alert('Please fix form errors before checkout');
        return;
      }
    
      setIsProcessing(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('✅ Payment Successful! Order confirmed.');
      
      console.log('Order details:', {
        formData,
        cart: carts,
        orderId: `ORD-${Date.now()}`,
        total: carts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });
      
      setIsProcessing(false);
    }
  });

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

  const handleAddressSelect = (id) => {
    if (id > 0 && userDetail) {
      setSelectedAddress(userDetail);
      // Pre-fill form with user data
      formik.setValues({
        ...formik.values,
        firstName: userDetail.name?.firstname || '',
        lastName: userDetail.name?.lastname || '',
        username: userDetail.username || '',
        email: userDetail.email || '',
        address: userDetail.address ? 
          `${userDetail.address.number} ${userDetail.address.street}, ${userDetail.address.city}, ${userDetail.address.zipcode}` : ''
      });
    } else {
      setSelectedAddress({});
      // Reset form to initial values
      formik.resetForm();
    }
  };

  return (
    <div className="container row m-auto">
      {/* 🛒 Cart Summary */}
      <CartCard cart={carts} />
      
      {/* 💳 Billing Form */}
      <div className="col-md-7 col-lg-8 pt-4 w-100">
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

        <form className="needs-validation" noValidate onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            {/* First Name */}
            <div className="col-sm-6">
              <label htmlFor="firstName" className="form-label">
                First name *
              </label>
              <input
                type="text"
                className={`form-control ${formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''}`}
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="invalid-feedback">{formik.errors.firstName}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="col-sm-6">
              <label htmlFor="lastName" className="form-label">
                Last name *
              </label>
              <input
                type="text"
                className={`form-control ${formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''}`}
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="invalid-feedback">{formik.errors.lastName}</div>
              )}
            </div>

            {/* Username */}
            <div className="col-12">
              <label htmlFor="username" className="form-label">
                Username *
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text">@</span>
                <input
                  type="text"
                  className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="invalid-feedback">{formik.errors.username}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email <span className="text-body-secondary">(Optional)</span>
              </label>
              <input
                type="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            {/* Address */}
            <div className="col-12">
              <label htmlFor="address" className="form-label">
                Address *
              </label>
              <input
                type="text"
                className={`form-control ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                id="address"
                name="address"
                placeholder="1234 Main St"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.address && formik.errors.address && (
                <div className="invalid-feedback">{formik.errors.address}</div>
              )}
            </div>

            {/* Address 2 */}
            <div className="col-12">
              <label htmlFor="address2" className="form-label">
                Address 2 <span className="text-body-secondary">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="address2"
                name="address2"
                placeholder="Apartment or suite"
                value={formik.values.address2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Country */}
            <div className="col-md-5">
              <label htmlFor="country" className="form-label">
                Country *
              </label>
              <select 
                className={`form-select ${formik.touched.country && formik.errors.country ? 'is-invalid' : ''}`}
                id="country" 
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              >
                <option value="">Choose...</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
              {formik.touched.country && formik.errors.country && (
                <div className="invalid-feedback">{formik.errors.country}</div>
              )}
            </div>

            {/* State */}
            <div className="col-md-4">
              <label htmlFor="state" className="form-label">
                State *
              </label>
              <select 
                className={`form-select ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
                id="state" 
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              >
                <option value="">Choose...</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
              </select>
              {formik.touched.state && formik.errors.state && (
                <div className="invalid-feedback">{formik.errors.state}</div>
              )}
            </div>

            {/* Zip */}
            <div className="col-md-3">
              <label htmlFor="zip" className="form-label">
                Zip *
              </label>
              <input 
                type="text" 
                className={`form-control ${formik.touched.zip && formik.errors.zip ? 'is-invalid' : ''}`}
                id="zip" 
                name="zip"
                value={formik.values.zip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required 
              />
              {formik.touched.zip && formik.errors.zip && (
                <div className="invalid-feedback">{formik.errors.zip}</div>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* Checkboxes */}
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="same-address"
              name="sameAddress"
              checked={formik.values.sameAddress}
              onChange={formik.handleChange}
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
              name="saveInfo"
              checked={formik.values.saveInfo}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="save-info">
              Save this information for next time
            </label>
          </div>

          <hr className="my-4" />

          <h4 className="mb-3">Payment *</h4>

          <div className="my-3">
            <div className="form-check">
              <input
                id="credit"
                name="paymentMethod"
                type="radio"
                className="form-check-input"
                value="credit"
                checked={formik.values.paymentMethod === 'credit'}
                onChange={formik.handleChange}
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
                value="debit"
                checked={formik.values.paymentMethod === 'debit'}
                onChange={formik.handleChange}
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
                value="paypal"
                checked={formik.values.paymentMethod === 'paypal'}
                onChange={formik.handleChange}
              />
              <label className="form-check-label" htmlFor="paypal">
                PayPal
              </label>
            </div>
            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
              <div className="text-danger small mt-1">{formik.errors.paymentMethod}</div>
            )}
          </div>

          {/* Payment Details - Conditionally shown for credit/debit cards */}
          {(formik.values.paymentMethod === 'credit' || formik.values.paymentMethod === 'debit') && (
            <div className="row gy-3">
              <div className="col-md-6">
                <label htmlFor="cc-name" className="form-label">
                  Name on card *
                </label>
                <input
                  type="text"
                  className={`form-control ${formik.touched.ccName && formik.errors.ccName ? 'is-invalid' : ''}`}
                  id="cc-name"
                  name="ccName"
                  value={formik.values.ccName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <small className="text-body-secondary">
                  Full name as displayed on card
                </small>
                {formik.touched.ccName && formik.errors.ccName && (
                  <div className="invalid-feedback">{formik.errors.ccName}</div>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="cc-number" className="form-label">
                  Credit card number *
                </label>
                <input
                  type="text"
                  className={`form-control ${formik.touched.ccNumber && formik.errors.ccNumber ? 'is-invalid' : ''}`}
                  id="cc-number"
                  name="ccNumber"
                  value={formik.values.ccNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ccNumber && formik.errors.ccNumber && (
                  <div className="invalid-feedback">{formik.errors.ccNumber}</div>
                )}
              </div>

              <div className="col-md-3">
                <label htmlFor="cc-expiration" className="form-label">
                  Expiration *
                </label>
                <input
                  type="text"
                  className={`form-control ${formik.touched.ccExpiration && formik.errors.ccExpiration ? 'is-invalid' : ''}`}
                  placeholder="MM/YY"
                  id="cc-expiration"
                  name="ccExpiration"
                  value={formik.values.ccExpiration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ccExpiration && formik.errors.ccExpiration && (
                  <div className="invalid-feedback">{formik.errors.ccExpiration}</div>
                )}
              </div>

              <div className="col-md-3">
                <label htmlFor="cc-cvv" className="form-label">
                  CVV *
                </label>
                <input
                  type="text"
                  className={`form-control ${formik.touched.ccCvv && formik.errors.ccCvv ? 'is-invalid' : ''}`}
                  id="cc-cvv"
                  name="ccCvv"
                  value={formik.values.ccCvv}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ccCvv && formik.errors.ccCvv && (
                  <div className="invalid-feedback">{formik.errors.ccCvv}</div>
                )}
              </div>
            </div>
          )}

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