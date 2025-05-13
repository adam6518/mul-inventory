import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/DataProject.css";
import "../assets/styles/global.css";
import SearchBar from "../components/SearchBar";
import { toast } from "react-toastify";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DataProject = () => {
  const [formValues, setFormValues] = useState({
    namaProject: "",
    nomorSi: "",
    nilaiProjectRaw: "",
    statusProject: "",
    tahapanProject: "",
  });
  const navigate = useNavigate();
  const [allDataProject, setAllDataProject] = useState([]);
  const [filteredProject, setFilteredProject] = useState([]);
  const [submittedProjects, setSubmittedProjects] = useState([]);
  const [nilaiProjectFormatted, setNilaiProjectFormatted] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [dataForOrder, setDataForOrder] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getAllDataProject();
  }, []);

  // Reset currentPage to 1 when filteredProject or allDataProject changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProject, allDataProject]);

  const getAllDataProject = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/project/get-project"
      );
      if (response.data.data && response.data.data.length > 0) {
        setAllDataProject(response.data.data);
      } else {
        console.log("Data kosong");
      }
    } catch (error) {
      toast.error("Gagal mendapatkan data project");
    }
  };

  const deleteDataProject = async (projectId) => {
    try {
      const request = await axios.delete(
        `http://localhost:3000/api/project/delete-project/${projectId}`
      );
      toast.success("Delete Data Project Berhasil !");
      setAllDataProject((prevData) =>
        prevData.filter((project) => project.iddata_project !== projectId)
      );
      setFilteredProject((prevData) =>
        prevData.filter((project) => project.iddata_project !== projectId)
      );
    } catch (error) {
      toast.error("Delete Data Project Gagal !");
    }
  };

  const searchDataProject = async (query) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/project/search-project",
        {
          params: {
            namaProject: query,
          },
        }
      );
      setFilteredProject(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    if (name === "nilaiProjectRaw") {
      formatCurrency(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nomorSiExists = allDataProject.some(
      (project) => project.no_si === formValues.nomorSi
    );

    if (nomorSiExists) {
      toast.error("Nomor SI/SP sudah ada, silakan gunakan nomor yang berbeda.");
      return; // Prevent submission
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/project/add-project",
        formValues
      );
      console.log(response, "res");
      if (response.data.success) {
        toast.success(
          response.data.message || "Project Berhasil Ditambahkan !"
        );
        setFormValues({
          namaProject: "",
          nomorSi: "",
          statusProject: "",
          tahapanProject: "",
          nilaiProjectFormatted: 0,
        });
        getAllDataProject();
      } else {
        toast.error(response.data.message || "Gagal Menambahkan Project!");
      }
    } catch (error) {
      console.log("Terdapat eror saat menambahkan project : ", error);
      toast.error("Tolong isi semua field nya");
    }
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setIsEditFormVisible(true);
  };

  const cancelEdit = () => {
    setIsEditFormVisible(false);
    setEditingProject(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProject({
      ...editingProject,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const nomorSiExists = allDataProject.some(
      (project) =>
        project.no_si === editingProject.no_si &&
        project.iddata_project !== editingProject.iddata_project
    );

    if (nomorSiExists) {
      toast.error(
        "Nomor SI/SP sudah ada pada project lain, silakan gunakan nomor yang berbeda."
      );
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/api/project/update-project`,
        editingProject
      );
      if (response.data.success) {
        toast.success("Project updated successfully!");
        setAllDataProject((prevData) =>
          prevData.map((proj) =>
            proj.iddata_project === editingProject.iddata_project
              ? editingProject
              : proj
          )
        );
        setFilteredProject((prevData) =>
          prevData.map((proj) =>
            proj.iddata_project === editingProject.iddata_project
              ? editingProject
              : proj
          )
        );
        setIsEditFormVisible(false);
        setEditingProject(null);
      } else {
        toast.error(response.data.message || "Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Error updating project.");
    }
  };

  const formatCurrency = (nilaiProjectRaw) => {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(nilaiProjectRaw));
    return formatted;
  };

  const openDetailForm = (project) => {
    console.log(project);

    setDataForOrder(project);
    if (!project) {
      toast.error("Cannot navigate to order page");
    } else {
      navigate("/order", {
        state: {
          nama_project: project.nama_project,
          tahapan: project.tahapan,
        },
      });
    }
  };

  const cancelOpenDetail = () => {
    setIsOpenDetail(false);
    setDataForOrder(null);
  };

  const submitToFinansial = async (e) => {
    e.preventDefault();
    try {
      const finansial = allDataProject.map(
        ({ nama_project, nilai_project }) => ({
          namaProject: nama_project,
          pendapatan: nilai_project,
          modalAwal: (75 / 100) * nilai_project,
          profit: (25 / 100) * nilai_project,
        })
      );
      const response = await axios.post(
        "http://localhost:3000/api/finansial/add-finansial",
        finansial
      );
      if (response.data.success) {
        toast.success(
          response.data.message || "Finansial Berhasil Ditambahkan !"
        );
      } else {
        toast.error(response.data.message || "Gagal Menambahkan Finansial!");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const addFormVisible = async () => {
    setIsAddFormVisible(true);
  };

  const cancelAdd = async () => {
    setIsAddFormVisible(false);
  };

  const dataToDisplay =
    filteredProject.length > 0 ? filteredProject : allDataProject;

  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);

  const currentData = dataToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showDeleteConfirmation = (project) => {
    Swal.fire({
      title: `Yakin ingin menghapus "${project.nama_project}"?`,
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDataProject(project.iddata_project);
        Swal.fire("Terhapus!", "Project berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="d-flex data-project">
      <div className="p-2 sidebar">
        <Sidebar />
      </div>
      <div className="p-2 table-data-project">
        <h1>Data Project</h1>
        <SearchBar
          placeholder="Search project by name..."
          onSearch={searchDataProject}
        />
        {isAddFormVisible && (
          <form onSubmit={handleSubmit} className="input-group mt-3">
            <input
              placeholder="Input Nama Project"
              type="text"
              className="form-control bg-body-secondary border-black border-2"
              name="namaProject"
              value={formValues.namaProject}
              onChange={handleInputChange}
            />
            <input
              placeholder="Input Nomor SI / SP"
              type="text"
              className="form-control  bg-body-secondary  border-black border-2"
              name="nomorSi"
              value={formValues.nomorSi}
              onChange={handleInputChange}
            />
            <input
              placeholder="Input Nilai Project"
              type="text"
              className="form-control  bg-body-secondary  border-black border-2"
              name="nilaiProjectRaw"
              value={formValues.nilaiProjectRaw}
              onChange={handleInputChange}
            />
            <select
              placeholder="Input Status Project"
              className="form-select  bg-body-secondary  border-black border-2"
              name="statusProject"
              onChange={handleInputChange}
              value={formValues.statusProject}
            >
              <option value="">Pilih Status</option>
              <option value="baru mulai">Baru Mulai</option>
              <option value="re-checklist">Re-checklist</option>
              <option value="done">Done</option>
            </select>
            <select
              placeholder="Pilih Tahapan"
              className="form-select  bg-body-secondary  border-black border-2"
              name="tahapanProject"
              onChange={handleInputChange}
              value={formValues.tahapanProject}
            >
              <option value="">Pilih Tahapan</option>
              <option value="proses penanaman">Proses Penanaman</option>
              <option value="st 1">ST 1</option>
              <option value="st 2 ke 1">ST 2 ke 1</option>
              <option value="st 2 ke 2">ST 2 ke 2</option>
            </select>
            <button type="submit" className="btn btn-success">
              Add
            </button>
            <button className="btn btn-danger" onClick={cancelAdd}>
              Cancel
            </button>
          </form>
        )}
        <div className="my-3">
          <div>
            <p>
              Notes : Tolong Klik Update Finansial Setiap Setelah Menambahkan
              atau Mengedit Data Project
            </p>
          </div>
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary btn-sm"
              onClick={submitToFinansial}
            >
              Update Finansial
            </button>
            <button className="btn btn-success btn-sm" onClick={addFormVisible}>
              Tambahkan Data Project Baru
            </button>
          </div>
        </div>
        {isOpenDetail && (
          <form onSubmit={handleEditSubmit} className="input-group mt-3">
            <input
              type="text"
              name="nama_project"
              value={dataForOrder.nama_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Item Pekerjaan"
              required
            />
            <input
              type="text"
              name="no_si"
              value={dataForOrder.no_si}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Nama Project"
              required
            />
            <input
              type="text"
              name="nilai_project"
              value={dataForOrder.nilai_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Volume BQ"
              required
            />
            <input
              type="text"
              name="nilai_project"
              value={dataForOrder.nilai_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="QTY Reject"
              required
            />
            <input
              type="text"
              name="nilai_project"
              value={dataForOrder.nilai_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="QTY Order"
              required
            />
            <input
              type="date"
              name="nilai_project"
              value={dataForOrder.nilai_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Tanggal Checklist"
              required
            />
            <select
              name="tahapan"
              value={dataForOrder.tahapan}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              required
            >
              <option value="">Pilih Tahapan</option>
              <option value="proses penanaman">Proses Penanaman</option>
              <option value="st 1">ST 1</option>
              <option value="st 2 ke 1">ST 2 ke 1</option>
              <option value="st 2 ke 2">ST 2 ke 2</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              onClick={cancelOpenDetail}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        )}
        {isEditFormVisible && (
          <form onSubmit={handleEditSubmit} className="input-group mt-3">
            <input
              type="text"
              name="nama_project"
              value={editingProject.nama_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Nama Project"
              required
            />
            <input
              type="text"
              name="no_si"
              value={editingProject.no_si}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Nomor SI / SP"
              required
            />
            <input
              type="text"
              name="nilai_project"
              value={editingProject.nilai_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Nilai Project"
              required
            />
            <select
              name="status"
              value={editingProject.status}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              required
            >
              <option value="">Pilih Status</option>
              <option value="baru mulai">Baru Mulai</option>
              <option value="re-checklist">Re-checklist</option>
              <option value="done">Done</option>
            </select>
            <select
              name="tahapan"
              value={editingProject.tahapan}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              required
            >
              <option value="">Pilih Tahapan</option>
              <option value="proses penanaman">Proses Penanaman</option>
              <option value="st 1">ST 1</option>
              <option value="st 2 ke 1">ST 2 ke 1</option>
              <option value="st 2 ke 2">ST 2 ke 2</option>
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
                <th scope="col">Nama Project</th>
                <th scope="col">No. SI / SP</th>
                <th scope="col">Nilai Project</th>
                <th scope="col">Status</th>
                <th scope="col">Tahapan</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentData.length > 0 ? (
                currentData.map((project, index) => (
                  <tr key={project.iddata_project || index}>
                    <th className="text-center" scope="row">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </th>
                    <td className="text-break">{project.nama_project}</td>
                    <td className="text-center text-break">{project.no_si}</td>
                    <td className="align-items-start text-break">
                      {formatCurrency(project.nilai_project)}
                    </td>
                    <td className="text-center text-break">{project.status}</td>
                    <td className="text-center text-break">
                      {project.tahapan}
                    </td>
                    <td className="text-center text-break">
                      <div className="d-flex gap-2 mb-2 justify-content-center">
                        <button
                          className="btn btn-primary btn-md flex-grow-1"
                          onClick={() => openEditForm(project)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            showDeleteConfirmation(project);
                          }}
                          className="btn btn-danger btn-md flex-grow-1"
                        >
                          Delete
                        </button>
                      </div>
                      {project.status === "re-checklist" ? (
                        <div className="d-flex justify-content-center">
                          <button
                            onClick={() => {
                              openDetailForm(project);
                            }}
                            className="btn btn-info flex-grow-1"
                          >
                            Go to Detail
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center">
                          <button className="btn btn-info flex-grow-1" disabled>
                            Go to Detail
                          </button>
                        </div>
                      )}
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
    </div>
  );
};

export default DataProject;
