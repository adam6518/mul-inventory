import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Login.css";
import logoMU from "../assets/img/logo-mu.jpg"

export default class Login extends Component {
  render() {
    return (
      <div className="form-login">
        <form className="border border-black">
        <img clasName="form-img" src={logoMU} alt="logo-mu" />
          <div className="form-username">
            <label className="form-label">Username</label>
            <input className="form-control" placeholder="Input username..." />
          </div>
          <div className="form-password">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Input password..."
            />
          </div>
          <button type="submit" className="form-btn-sign-in btn btn-warning">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/dataproject">Sign In</Link>
          </button>
          <p className="form-p">Notes : Harap hubungi Admin jika belum mempunyai akun !</p>
        </form>
      </div>
    );
  }
}
