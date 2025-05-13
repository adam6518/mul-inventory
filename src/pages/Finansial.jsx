import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import "../assets/styles/Finansial.css";
import "../assets/styles/global.css";
import { toast } from "react-toastify";
import axios from "axios";

const Finansial = () => {
  const [allFinansial, setAllFinansial] = useState([]);
  const [filteredFinansial, setFilteredFinansial] = useState([]);
  const [sortFinansial, setSortRiwayat] = useState("ASC");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getAllDataFinansial();
    sortPendapatan(sortFinansial);
  }, [sortFinansial]);

  // Reset currentPage to 1 when allFinansial changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allFinansial]);

  const getAllDataFinansial = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/finansial/get-finansial"
      );
      if (response.data.data && response.data.data.length > 0) {
        setAllFinansial(response.data.data);
      } else {
        console.log("Data kosong");
      }
    } catch (error) {
      toast.error("Gagal mendapatkan data finansial");
    }
  };

  const searchFinansial = async (query) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/finansial/search-finansial",
        {
          params: {
            item: query,
          },
        }
      );
      setFilteredFinansial(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dataToDisplay =
    filteredFinansial.length > 0 ? filteredFinansial : allFinansial;

  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);

  const currentData = dataToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortPendapatan = async (order) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/finansial/sort-finansial?order=${order}`
      );
      if (response.data.data) {
        setFilteredFinansial(response.data.data);
      } else {
        toast.error("Gagal Menampilkan Data Sorting");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortChange = async (e) => {
    setSortRiwayat(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (nilaiProjectRaw) => {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(nilaiProjectRaw));
    return formatted;
  };

  return (
    <div className="d-flex data-finansial">
      <div className="p-2 sidebar">
        <Sidebar />
      </div>
      <div className="p-2 table-data-finansial">
        <h1>Finansial</h1>
        <SearchBar
          placeholder="Search finansial by name..."
          onSearch={searchFinansial}
        />
        <div className="col-2 mt-3">
          <select
            placeholder="Berdasarkan Tanggal Order"
            className="form-select bg-warning"
            onChange={handleSortChange}
            value={sortFinansial}
          >
            <option value="">Urutkan Nilai Project</option>
            <option value="DESC">Terbesar</option>
            <option value="ASC">Terendah</option>
          </select>
        </div>

        <div className="table-container  my-3">
          <table className="table table-striped-columns">
            <thead className="text-center table-primary sticky-header">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama Project</th>
                <th scope="col">Pendapatan</th>
                <th scope="col">Modal Awal</th>
                <th scope="col">Profit</th>
              </tr>
            </thead>

            <tbody className="table-group-divider">
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id || index}>
                    <th scope="row">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </th>
                    <td className="text-break">{item.nama_project}</td>
                    <td className="text-break">
                      {formatCurrency(item.pendapatan)}
                    </td>
                    <td className="text-break">
                      {formatCurrency(item.modal_awal)}
                    </td>
                    <td className="text-break">
                      {formatCurrency(item.profit)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
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

export default Finansial;
