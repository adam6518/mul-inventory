import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/DataProject.css";
import { Fragment } from "react";

export default class DataProject extends Component {
  render() {
    return (
      <div className="d-flex data-project">
        {/* <>
          <Sidebar />
        </> */}
        <div className="p-2 sidebar">
          <Sidebar />
        </div>
        <div className="p-2 table-data-project">
          <h1>Data Project</h1>
          <input
            type="text"
            className="form-control"
            placeholder="Search here..."
          ></input>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama Project</th>
                <th scope="col">No. SI / SP</th>
                <th scope="col">Nilai Project</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>
                  <button className="btn btn-primary">Edit</button>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
