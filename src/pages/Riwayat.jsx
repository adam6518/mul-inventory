import React, { Component, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import "../assets/styles/Riwayat.css";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";

const Riwayat = () => {
  const [allDataRiwayat, setAllDataRiwayat] = useState([]);
  const [filteredRiwayat, setFilteredRiwayat] = useState([]);
  const [sortRiwayat, setSortRiwayat] = useState("ASC");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getAllDataRiwayat();
    sortDate(sortRiwayat);
  }, [sortRiwayat]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRiwayat, allDataRiwayat]);

  const getAllDataRiwayat = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/riwayat/get-riwayat"
      );
      if (response.data.data && response.data.data.length > 0) {
        setAllDataRiwayat(response.data.data);
      } else {
        console.log("Data kosong");
      }
    } catch (error) {
      toast.error("Gagal mendapatkan data riwayat");
    }
  };

  const searchRiwayat = async (query) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/riwayat/search-riwayat",
        {
          params: {
            item: query,
          },
        }
      );
      setFilteredRiwayat(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateDMY = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const sortDate = async (order) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/riwayat/sort-riwayat?order=${order}`
      );
      if (response.data.data) {
        setFilteredRiwayat(response.data.data);
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

  const dataToDisplay =
    filteredRiwayat.length > 0 ? filteredRiwayat : allDataRiwayat;

  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);

  const currentData = dataToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="d-flex data-riwayat">
      <div className="p-2 sidebar">
        <Sidebar />
      </div>
      <div className="p-2 table-data-riwayat">
        <h1>Riwayat</h1>
        <SearchBar
          placeholder="Search riwayat by item..."
          onSearch={searchRiwayat}
        />
        <div className="col-2 mt-3">
          <select
            placeholder="Berdasarkan Tanggal Order"
            className="form-select bg-warning"
            onChange={handleSortChange}
            value={sortRiwayat}
          >
            <option value="">Urutkan Riwayat</option>
            <option value="DESC">Terbaru</option>
            <option value="ASC">Terlama</option>
          </select>
        </div>
        <div className="table-container my-3">
          <table className="table table-striped-columns">
            <thead className="text-center table-primary sticky-header">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Item</th>
                <th scope="col">Lokasi Penanaman</th>
                <th scope="col">Total</th>
                <th scope="col">Tanggal Order</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentData.length > 0 ? (
                currentData.map((riwayat, index) => (
                  <tr key={riwayat.idriwayat || index}>
                    <th className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                    <td className="text-break">{riwayat.item_ordered}</td>
                    <td className="text-break">{riwayat.lokasi_penanaman}</td>
                    <td className="text-center text-break">{riwayat.qty_ordered}</td>
                    <td className="text-center text-break">{formatDateDMY(riwayat.tanggal_order)}</td>
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
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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

export default Riwayat;
