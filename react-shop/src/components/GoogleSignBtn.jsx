import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import axios from "axios";

function GoogleSignBtn({ isLogin }) {
  const history = useHistory();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        console.log("✅ Google User Info:", res.data);
        localStorage.setItem("googleUser", JSON.stringify(res.data));
        history.push("/home");
      } catch (error) {
        console.error("❌ Failed to fetch Google user info:", error);
      }
    },
    onError: (errorResponse) => {
      console.error("❌ Google Login Error:", errorResponse);
    },
  });

  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center mb-3">
      <button className="btn btn-google d-flex gap-3 justify-content-center border-primary p-2" onClick={() => login()}>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          style={{ width: "20px" }}
          alt="Google logo"
        />
        <span>
          {isLogin ? "Sign in with Google" : "Sign up using Google"}
        </span>
      </button>
    </div>
  );
}

export default GoogleSignBtn;
