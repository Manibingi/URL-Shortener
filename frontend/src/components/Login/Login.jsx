import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import style from "./Login.module.css";
import logo from "../../assets/cuvette.svg";

const Login = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // handling the form input
  const handleLoginForm = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // handling the form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // checking if the password and confirm password match

    // sending the Registerform data to the backend
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        loginForm
      );

      if (response.status === 200) {
        setLoginForm({
          email: "",
          password: "",
        });
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        navigate("/main");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  // if user already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.success("User Already Logged In");
      navigate("/main");
    }
  }, []);

  return (
    <>
      <div className={style.registerContainer}>
        <div className={style.leftContainer}>
          <div className={style.logo}>
            <img src={logo} alt="logo.png" />
          </div>
        </div>
        <div className={style.rightContainer}>
          <div className={style.buttons}>
            <button className={style.signUpBtn} onClick={() => navigate("/")}>
              SignUp
            </button>
            <button className={style.loginBtn}>Login</button>
          </div>
          <div className={style.registerFormContent}>
            <div className={style.joinUs}>
              <p>Login</p>
            </div>

            <form onSubmit={handleLoginSubmit} className={style.registerForm}>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email id"
                value={loginForm.email}
                onChange={handleLoginForm}
                required
              />
              <br />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginForm}
                required
              />
              <br />
              <button type="submit">Login</button>
            </form>

            <div className={style.alreadyHaveAccount}>
              <p>
                Don't have an account? <Link to={"/"}>SignUp</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
