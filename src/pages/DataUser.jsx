import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/DataUser.css";
import SearchBar from "../components/SearchBar";

export default class DataUser extends Component {
  render() {
    return (
      <div className="d-flex data-user">
        {/* <>
          <Sidebar />
        </> */}
        <div className="p-2 sidebar">
          <Sidebar />
        </div>
        <div className="p-2 table-data-user">
          <h1>Data User</h1>
          <SearchBar/>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama</th>
                <th scope="col">Username</th>
                <th scope="col">Status / Role</th>
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
