import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Sidebar.css";
import logoMU from "../assets/img/logo-mu.jpg";

export default class sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <img
          style={{ width: "500%", height: "auto" }}
          src={logoMU}
          alt="Logo PT"
        />
        <div className="sidebar-title my-1">
          <h1>Sistem Inventori</h1>
        </div>
        <div
          className="btn-group-vertical gap-3"
          role="group"
          aria-label="Vertical button group"
        >
          <button
            type="button"
            className="btn btn-outline-danger d-grid btn-lg"
          >
           <Link style={{ textDecoration: "none", color: "inherit" }} to="/dataproject">Data Project</Link>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger d-grid btn-lg"
          >
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/datachecklist">Data Checklist</Link>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger d-grid btn-lg"
          >
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/order">Order</Link>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger d-grid btn-lg"
          >
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/finance">Finansial</Link>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger d-grid btn-lg"
          >
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/analyze">Analisa</Link>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger d-grid btn-lg"
          >
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/datauser">Data User</Link>
          </button>
        </div>

        <button
          type="button"
          className="btn-signout btn btn-outline-danger btn-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-box-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
            />
            <path
              fill-rule="evenodd"
              d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
            />
          </svg>{" "}
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">Sign Out</Link>
        </button>
      </div>
    );
  }
}
