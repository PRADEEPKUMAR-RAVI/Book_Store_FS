// src/components/RegisterForm.jsx
import React, { useState } from "react";
import { userRegister } from "../services/AuthApi";
import { useNavigate } from "react-router";

const RegisterForm = ({ switchToLogin }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await userRegister(form);
      alert("Registration successful! Please log in.");
      switchToLogin(); 
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed.";
      setError(msg);
    }
  };

  return (
    <div className="register-form">
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <button
          type="submit"
        >
          Register
        </button>
      </form>

    </div>
  );
};

export default RegisterForm;
