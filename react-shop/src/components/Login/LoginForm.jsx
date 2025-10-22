import React from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import GoogleSignBtn from "../GoogleSignBtn";
import api from "../../services/api";

function RegisterForm({ onSwitchTab }) {
  const history = useHistory();
  
  const formik = useFormik({
    initialValues: {
      loginName: '',
      loginPassword: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      loginName: Yup.string().required('Email or username is required'),
      loginPassword: Yup.string().required('Password is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await api.post("/auth/login", {
          username: values.loginName,
          password: values.loginPassword
        });
  
        console.log("✅ Successfully logged in:", response.data);
  
        localStorage.setItem("token", JSON.stringify(response.data.token));

        resetForm();
  
        alert(" Successfully logged in!");
        history.push("/home");
      } catch (error) {
        console.error("❌ Failed to log in:", error);
        alert("Failed to log in");
      }
    }
  });

  return (
    <form className="d-flex flex-column justify-content-center" onSubmit={formik.handleSubmit}>
      <GoogleSignBtn isLogin={true} />

      <p className="text-center">or:</p>

      {/* Email input */}
      <div className="form-outline mb-4">
        <label className="form-label" htmlFor="loginName">
          Email or username *
        </label>
        <input 
          type="text" 
          id="loginName" 
          name="loginName"
          className={`form-control ${formik.touched.loginName && formik.errors.loginName ? 'is-invalid' : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.loginName}
        />
        {formik.touched.loginName && formik.errors.loginName && (
          <div className="invalid-feedback">{formik.errors.loginName}</div>
        )}
      </div>

      {/* Password input */}
      <div className="form-outline mb-4">
        <label className="form-label" htmlFor="loginPassword">
          Password *
        </label>
        <input 
          type="password" 
          id="loginPassword" 
          name="loginPassword"
          className={`form-control ${formik.touched.loginPassword && formik.errors.loginPassword ? 'is-invalid' : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.loginPassword}
        />
        {formik.touched.loginPassword && formik.errors.loginPassword && (
          <div className="invalid-feedback">{formik.errors.loginPassword}</div>
        )}
      </div>

      {/* 2 column layout */}
      <div className="row mb-4">

        <div className="col-md-6 mb-4">
          {/* Simple link */}
          <a href="#!">Forgot password?</a>
        </div>
        <div className="col-md-6 w-100 d-flex">
          {/* Checkbox */}
          <div className="form-check mb-3 mb-md-0">
            <input 
              className="form-check-input" 
              type="checkbox" 
              name="rememberMe"
              id="loginCheck" 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.rememberMe}
            />
            <label className="form-check-label" htmlFor="loginCheck"> 
              Remember me 
            </label>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="btn btn-primary btn-block mb-4"
      >
        Sign in
      </button>

      {/* Register button */}
      <div className="text-center">
        <p onClick={onSwitchTab}>
          Not a member? <button type="button" onClick={onSwitchTab} className="btn btn-link p-0 pb-1">
            Register
          </button>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;