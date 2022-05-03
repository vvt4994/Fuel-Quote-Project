import React, { useContext, useState } from "react";
import "../css/Register.css";

import axios from "axios";
import AppContext from "./AppContext";
import { useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const onChangeHandler = (e) => {
    //when user type Name, Email, password
    // setUserInput will update value into userInput
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault(); // current Page will not reload when submit

      const options = {
        method: "post",
        url: "/api/v1/auth/register",
        data: userInput, // data is name, email, password from the form
      };

      // send request to server
      const response = await axios(options);

      // get TOKEN and userName from the response
      const { token, userName } = response.data.data;

      // save TOKEN into Local Storage
      localStorage.setItem("token", token);

      // use DISPATCH to update the initital State with userName from the server
      dispatch({
        type: "CURRENT_USER",
        payload: { userName },
      });

      navigate("/");

      dispatch({
        type: "CURRENT_USER",
        payload: null,
      });

      alert("succesfully registered, Please login to continue");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div id="hero" className="container has-two-col">
      <div id="register">
        <form id="register-form" onSubmit={onSubmitHandler}>
          <div id="form-name">
            <h2>Register Form</h2>
          </div>

          <div id="id-password-submit">
            {errorMessage &&
              (Array.isArray(errorMessage) ? ( // check if errorMessage is an array?
                errorMessage.map((err) => (
                  <div className="error-message">Error: {err}</div>
                ))
              ) : (
                <div className="error-message">Error: {errorMessage}</div>
              ))}

            <div id="full-name">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={userInput.name}
                onChange={onChangeHandler}
              />
            </div>

            <div id="email">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userInput.email}
                onChange={onChangeHandler}
              />
            </div>

            <div id="password">
              <input
                type={passwordShown ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={userInput.password}
                onChange={onChangeHandler}
              ></input>

              <span id="show-password" onClick={togglePassword}>
                Show
              </span>
            </div>

            <div id="register">
              <button type="submit"> Create Account</button>
            </div>
          </div>
        </form>
      </div>

      <div id="hero-right">
        <img src="image/background1/people.png" alt="" />
      </div>
    </div>
  );
}
