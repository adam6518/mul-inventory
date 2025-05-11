import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";
import logoMU from "../assets/img/logo-mu.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("Event terpanggil");

    e.preventDefault();
    console.log(username, password);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login-user",
        { username: username, password: password }
      );
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Login Berhasil !");
        console.log(response);
        sessionStorage.setItem("nama", response.data.nama);
        sessionStorage.setItem("username", response.data.username);
        sessionStorage.setItem("userRole", response.data.role);
        sessionStorage.setItem("isLoggedIn", response.data.isLoggedIn);
        console.log(typeof response.data.isLoggedIn);

        // navigate("/dataproject", { replace: true });
        window.location.href = "/dataproject";
      } else {
        toast.error(response.data.message || "Login Gagal !");
      }
    } catch (error) {
      console.log("Terdapat eror saat login : ", error);
      toast.error(error.response.data.message || "Coba lagi");
    }
  };

  return (
    <div className="form-login">
      <form onSubmit={handleSubmit} className="border border-black">
        <img className="form-img" src={logoMU} alt="logo-mu" />
        <div className="form-username">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Input username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-password">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Input password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="form-btn-sign-in btn btn-warning">
          Sign In
          {/* <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/dataproject"
          >
            Sign In
          </Link> */}
        </button>
        <p className="form-p">
          Notes : Harap hubungi Admin jika belum mempunyai akun !
        </p>
      </form>
    </div>
  );
};

export default Login;
