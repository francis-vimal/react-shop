import React from "react";

function GoogleSignBtn(props) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center mb-3">
      <button className="btn btn-google d-flex gap-3 justify-content-center border-primary p-2">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          style={{ width: "20px" }}
        />
        <span>
          {props.isLogin ? "Sign in with Google" : "Sign up using Google"}
        </span>
      </button>
    </div>
  );
}

export default GoogleSignBtn;
