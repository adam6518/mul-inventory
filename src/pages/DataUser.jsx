import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/DataUser.css";
import SearchBar from "../components/SearchBar";
// import Swal from 'sweetalert2'
import { toast } from "react-toastify";
import axios from "axios";

const DataUser = () => {
  const [formValues, setFormValues] = useState({
    nama: "",
    username: "",
    password: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register-user",
        formValues
      );
      console.log(response, 'res');
      if(response.data.success) {
        toast.success(response.data.message || 'Registrasi Berhasil !')
        setFormValues({nama:"", username:"", password:"", role:""})
      }else {
        toast.error(response.data.message || 'Gagal Mendaftarkan User!')
      }
    } catch (error) {
      console.log('Terdapat eror saat registrasi : ', error);
      toast.error(error.response.data.error.message|| error.response.data.message || 'Coba lagi')
      
    }
  };

  return (
    <div className="d-flex data-user">
      <div className="p-2 sidebar">
        <Sidebar />
      </div>
      <div className="p-2 table-data-user">
        <h1>Data User</h1>
        <SearchBar />
        <form onSubmit={handleSubmit} className="input-group mt-3">
          <input
            placeholder="Input Nama Karyawan"
            type="text"
            className="form-control"
            name="nama"
            value={formValues.nama}
            onChange={handleInputChange}
          />
          <input
            placeholder="Input Username"
            type="text"
            className="form-control"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
          />
          <input
            placeholder="Input Password"
            type="text"
            className="form-control"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
          />
          <select
            placeholder="Pilih role"
            className="form-select"
            onChange={handleInputChange}
            name="role"
            value={formValues.role}
          >
            <option value="">
              Pilih Role
            </option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </form>
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
};

export default DataUser;
