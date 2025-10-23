import React from "react";
import GoogleSignBtn from "../GoogleSignBtn";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Repeat password is required"),
  agreed: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

function RegisterForm() {
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      agreed: false,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await api.post("/users", JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }));
        resetForm();
        alert("User created successfully!");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user.");
      }
    }
  });
  return (
    <form
      className="d-flex flex-column justify-content-center"
      onSubmit={formik.handleSubmit}
    >
      <GoogleSignBtn isLogin={false} />

      <p className="text-center">or:</p>

      {/* Username input */}
      <div className="form-outline mb-4">
        <label className="form-label" htmlFor="registerUsername">
          Username *
        </label>
        <input
          type="text"
          id="registerUsername"
          name="username"
          className={`form-control ${
            formik.touched.username && formik.errors.username
              ? "is-invalid"
              : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="invalid-feedback">{formik.errors.username}</div>
        )}
      </div>

      {/* Email input */}
      <div className="form-outline mb-4">
        <label className="form-label" htmlFor="registerEmail">
          Email *
        </label>
        <input
          type="email"
          id="registerEmail"
          name="email"
          className={`form-control ${
            formik.touched.email && formik.errors.email ? "is-invalid" : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="invalid-feedback">{formik.errors.email}</div>
        )}
      </div>

      {/* Password input */}
      <div className="form-outline mb-4">
        <label className="form-label" htmlFor="registerPassword">
          Password *
        </label>
        <input
          type="password"
          id="registerPassword"
          name="password"
          className={`form-control ${
            formik.touched.password && formik.errors.password
              ? "is-invalid"
              : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="invalid-feedback">{formik.errors.password}</div>
        )}
      </div>

      {/* Repeat Password input */}
      <div className="form-outline mb-4">
        <label className="form-label" htmlFor="registerRepeatPassword">
          Repeat password *
        </label>
        <input
          type="password"
          id="registerRepeatPassword"
          name="repeatPassword"
          className={`form-control ${
            formik.touched.repeatPassword && formik.errors.repeatPassword
              ? "is-invalid"
              : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.repeatPassword}
        />
        {formik.touched.repeatPassword && formik.errors.repeatPassword && (
          <div className="invalid-feedback">{formik.errors.repeatPassword}</div>
        )}
      </div>

      {/* Checkbox */}
      <div className="form-check mb-4">
        <input
          className={`form-check-input me-2 ${
            formik.touched.agreed && formik.errors.agreed ? "is-invalid" : ""
          }`}
          type="checkbox"
          name="agreed"
          id="registerCheck"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          checked={formik.values.agreed}
        />
        <label className="form-check-label" htmlFor="registerCheck">
          I have read and agree to the terms *
        </label>
        {formik.touched.agreed && formik.errors.agreed && (
          <div className="invalid-feedback d-block">{formik.errors.agreed}</div>
        )}
      </div>

      {/* Submit button */}
      <button type="submit" className="btn btn-primary btn-block mb-3">
        Sign up
      </button>
    </form>
  );
}

export default RegisterForm;
