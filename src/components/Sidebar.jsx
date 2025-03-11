import React, { Component } from "react";
import "../assets/styles/Sidebar.css";
import logoMU from "../assets/img/logo-mu.jpg";

export default class sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <img
          style={{ width: "100%", height: "auto" }}
          src={logoMU}
          alt="Logo PT"
        />
        <h1>Sistem Inventori</h1>
        <div
          className="btn-group-vertical"
          role="group"
          aria-label="Vertical button group"
        >
          <button type="button" className="btn btn-outline-danger">
            Data Project
          </button>
          <button type="button" className="btn btn-outline-danger">
            Data Checklist
          </button>
          <button type="button" className="btn btn-outline-danger">
            Order
          </button>
          <button type="button" className="btn btn-outline-danger">
            Finansial
          </button>
          <button type="button" className="btn btn-outline-danger">
            Analisa
          </button>
          <button type="button" className="btn btn-outline-danger">
            Data User
          </button>
        </div>
      </div>
    );
  }
}
