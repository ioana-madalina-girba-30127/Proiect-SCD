import React from "react";

import "./Auth.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/user/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (data.accessToken) {
      alert("success");
      navigate("/locations");
    } else {
      alert("invalid");
    }
    console.log(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };
  return (
    <div className="container">
      <h1>Register</h1>
      <form className="form" onSubmit={onSubmitRegister}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />
        <span>
          Have an account?
          <a href="/login" className="login-register">
            Login
          </a>
        </span>

        <input className="butt" type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
