import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/Order.css";
import SearchBar from "../components/SearchBar";

export default class DataProject extends Component {
  render() {
    return (
      <div className="d-flex order">
        {/* <>
          <Sidebar />
        </> */}
        <div className="p-2 sidebar d-flex">
          <Sidebar />
        </div>
        <div className="p-2 table-order">
          <h1>Order</h1>
          <SearchBar />
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Item Pekerjaan</th>
                <th scope="col">Qty</th>
                <th scope="col">Nama Project</th>
                <th scope="col">Keterangan</th>
                <th scope="col">Tanggal Order</th>
                <th scope="col">Lampiran</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </table>
          <div className="submit">
            <button className="btn btn-info btn-lg d-grid">Submit</button>
          </div>
        </div>
      </div>
    );
  }
}
