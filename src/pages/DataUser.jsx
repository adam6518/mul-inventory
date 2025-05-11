import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/DataUser.css";
import "../assets/styles/global.css";
import SearchBar from "../components/SearchBar";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const DataUser = () => {
  const [formValues, setFormValues] = useState({
    nama: "",
    username: "",
    password: "",
    role: "",
  });
  const [allDataUser, setAllDataUser] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getAllDataUser();
  }, []);

  // Reset currentPage to 1 when filteredUser or allDataUser changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUser, allDataUser]);

  const getAllDataUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/get-user"
      );
      console.log(response);
      if (response.data.data && response.data.data.length > 0) {
        setAllDataUser(response.data.data);
      } else {
        console.log("Data Kosong");
      }
    } catch (error) {
      toast.error("Gagal mendapatkan data user");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const request = await axios.delete(
        `http://localhost:3000/api/user/delete-user/${userId}`
      );
      console.log(userId);
      toast.success("Delete Data User Berhasil !");
      setAllDataUser((prevData) =>
        prevData.filter((user) => user.iddata_users !== userId)
      );
      setFilteredUser((prevData) =>
        prevData.filter((user) => user.iddata_users !== userId)
      );
    } catch (error) {
      toast.error("Delete Data User Gagal !");
    }
  };

  const searchDataUser = async (query) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/search-user",
        {
          params: {
            nama: query,
          },
        }
      );
      console.log(response);
      setFilteredUser(response.data.data);
      console.log(filteredUser);
    } catch (error) {
      console.log(error);
    }
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setIsEditFormVisible(true);
  };

  const cancelEdit = () => {
    setIsEditFormVisible(false);
    setEditingUser(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const usernameExist = allDataUser.some(
      (user) =>
        user.username === editingUser.username &&
        user.iddata_users !== editingUser.iddata_users
    );
    if (usernameExist) {
      toast.error("Username sudah ada, silakan gunakan username yang berbeda.");
      return; // Prevent submission
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/update-user`,
        editingUser
      );
      if (response.data.success) {
        toast.success("User Updated Successfully!");
        setAllDataUser((prevData) =>
          prevData.map((user) =>
            user.iddata_users === editingUser.iddata_users ? editingUser : user
          )
        );
        setFilteredUser((prevData) =>
          prevData.map((user) =>
            user.iddata_users === editingUser.iddata_users ? editingUser : user
          )
        );
        setIsEditFormVisible(false);
        setEditingUser(null);
      } else {
        toast.error(response.data.message || "Failed to update user.");
      }
    } catch (error) {
      toast.error("Error updating user.");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formValues);
    const usernameExist = allDataUser.some(
      (user) => user.username === formValues.username
    );
    if (usernameExist) {
      toast.error("Username sudah ada, silakan gunakan username yang berbeda.");
      return; // Prevent submission
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register-user",
        formValues
      );
      console.log(response, "res");
      if (response.data.success) {
        toast.success(response.data.message || "Registrasi Berhasil !");
        setFormValues({ nama: "", username: "", password: "", role: "" });
        getAllDataUser();
      } else {
        toast.error(response.data.message || "Gagal Mendaftarkan User!");
      }
    } catch (error) {
      console.log("Terdapat eror saat registrasi : ", error);
      toast.error(
        error.response.data.error.message ||
          error.response.data.message ||
          "Coba lagi"
      );
    }
  };

  const addFormVisible = async () => {
    setIsAddFormVisible(true);
  };

  const cancelAdd = async () => {
    setIsAddFormVisible(false);
  };

  const dataToDisplay = filteredUser.length > 0 ? filteredUser : allDataUser;

  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);

  const currentData = dataToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showDeleteConfirmation = (user) => {
    Swal.fire({
      title: `Yakin ingin menghapus "${user.nama}"?`,
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user.iddata_users);
        Swal.fire("Terhapus!", "User berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="d-flex data-user">
      <div className="p-2 sidebar">
        <Sidebar />
      </div>
      <div className="p-2 table-data-user">
        <h1>Data User</h1>
        <SearchBar
          placeholder="Search user by name..."
          onSearch={searchDataUser}
        />
        {isAddFormVisible && (
          <form onSubmit={handleSubmit} className="input-group mt-3">
            <input
              placeholder="Input Nama Karyawan"
              type="text"
              className="form-control bg-body-secondary border-black border-2"
              name="nama"
              value={formValues.nama}
              onChange={handleInputChange}
            />
            <input
              placeholder="Input Username"
              type="text"
              className="form-control bg-body-secondary border-black border-2"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
            />
            <input
              placeholder="Input Password"
              type="text"
              className="form-control bg-body-secondary border-black border-2"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            <select
              placeholder="Pilih role"
              className="form-select bg-body-secondary border-black border-2"
              onChange={handleInputChange}
              name="role"
              value={formValues.role}
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <button type="submit" className="btn btn-success">
              Add
            </button>
            <button className="btn btn-danger" onClick={cancelAdd}>
              Cancel
            </button>
          </form>
        )}
        <div className="d-flex gap-3 my-3">
          <button className="btn btn-success btn-sm" onClick={addFormVisible}>
            Tambahkan Data User Baru
          </button>
        </div>
        {isEditFormVisible && (
          <form onSubmit={handleEditSubmit} className="input-group mt-3">
            <input
              placeholder="Input Nama Karyawan"
              type="text"
              className="form-control bg-body-secondary border-black border-2"
              name="nama"
              value={editingUser.nama}
              onChange={handleEditInputChange}
            />
            <input
              placeholder="Input Username"
              type="text"
              className="form-control bg-body-secondary border-black border-2"
              name="username"
              value={editingUser.username}
              onChange={handleEditInputChange}
            />
            <select
              placeholder="Pilih role"
              className="form-select bg-body-secondary border-black border-2"
              onChange={handleEditInputChange}
              name="role"
              value={editingUser.role}
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        )}
        <div className="table-container my-3">
          <table className="table table-striped-columns">
            <thead className="text-center table-primary sticky-header">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama</th>
                <th scope="col">Username</th>
                <th scope="col">Status / Role</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentData.length > 0 ? (
                currentData.map((user, index) => (
                  <tr key={user.iddata_users || index}>
                    <th scope="row">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </th>
                    <td className="text-break">{user.nama}</td>
                    <td className="text-break">{user.username}</td>
                    <td className="text-center text-break">{user.role}</td>
                    <td className="text-center d-flex flex-column gap-2 justify-content-center text-break">
                      <button
                        className="btn btn-primary"
                        onClick={() => openEditForm(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          showDeleteConfirmation(user);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Data tidak tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bootstrap Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default DataUser;
