import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/DataChecklist.css";
import SearchBar from "../components/SearchBar";

export default class DataChecklist extends Component {
  render() {
    return (
      <div className="d-flex data-checklist">
        <div className="p-2 sidebar">
          <Sidebar />
        </div>
        <div className="p-2 table-data-checklist">
          <h1>Data Checklist</h1>
          <SearchBar/>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama Project</th>
                <th scope="col">Status</th>
                <th scope="col">Tahapan</th>
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
