import React, { Component, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/styles/Order.css";
import "../assets/styles/global.css";
import SearchBar from "../components/SearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nama_project, tahapan } = location.state || {};

  const [order, setOrder] = useState({
    itemPekerjaan: "",
    namaProject: "",
    volumeBq: "",
    qtyReject: "",
    qtyOrder: "",
    tanggalChecklist: "",
    tahapan: "",
  });
  const [allDataOrder, setAllDataOrder] = useState([]);
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [orderForm, setOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Location state:", location.state);
    if (
      location.state &&
      location.state.nama_project &&
      location.state.tahapan
    ) {
      setOrder((prev) => ({
        ...prev,
        namaProject: nama_project,
        tahapan: tahapan,
      }));
      setOrderForm(true);
    } else {
      setOrderForm(false);
      toast.error(
        "Jika ingin order harus melalui halaman Data Project dan klik Go to Detail"
      );
    }
    getAllDataOrder();
  }, []);

  // Reset currentPage to 1 when filteredOrder or allDataOrder changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrder, allDataOrder]);

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("sv-SE"); // 'sv-SE' = ISO format: YYYY-MM-DD
  };

  const formatDateDMY = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const getAllDataOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/order/get-order"
      );
      if (response.data.data && response.data.data.length > 0) {
        setAllDataOrder(response.data.data);
      } else {
        console.log("Data kosong");
      }
    } catch (error) {
      toast.error("Gagal mendapatkan data order");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value,
    });
  };

  const searchDataOrder = async (query) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/order/search-order",
        {
          params: {
            itemPekerjaan: query,
          },
        }
      );
      setFilteredOrder(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDataOrder = async (orderId) => {
    try {
      const request = await axios.delete(
        `http://localhost:3000/api/order/delete-order/${orderId}`
      );
      toast.success("Delete Data Order Berhasil !");
      setAllDataOrder((prevData) =>
        prevData.filter((order) => order.iddata_order !== orderId)
      );
      setFilteredOrder((prevData) =>
        prevData.filter((order) => order.iddata_order !== orderId)
      );
    } catch (error) {
      toast.error("Delete Data Order Gagal !");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedOrder = {
      ...order,
      tanggalChecklist: formatDateForInput(order.tanggalChecklist),
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/order/add-order",
        formattedOrder
      );
      if (response.data.success) {
        toast.success(response.data.message || "Order Berhasil Ditambahkan !");
        setOrder({
          itemPekerjaan: "",
          namaProject: "",
          volumeBq: "",
          qtyReject: "",
          qtyOrder: "",
          tanggalChecklist: "",
          tahapan: "",
        });
        getAllDataOrder();
      } else {
        toast.error(response.datamessage || "Gagal Menambahkan Order!");
      }
    } catch (error) {
      toast.error("Tolong isi semua field nya");
    }
  };

  const handleEditInputChange = async (e) => {
    const { name, value } = e.target;
    setEditingOrder({
      ...editingOrder,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formattedEditOrder = {
      ...editingOrder,
      tanggal_checklist: formatDateForInput(editingOrder.tanggal_checklist),
    };
    try {
      const response = await axios.put(
        `http://localhost:3000/api/order/update-order`,
        formattedEditOrder
      );
      if (response.data.success) {
        toast.success("Order updated successfully!");
        setAllDataOrder((prevData) =>
          prevData.map((order) =>
            order.iddata_order === editingOrder.iddata_order
              ? editingOrder
              : order
          )
        );
        setFilteredOrder((prevData) =>
          prevData.map((order) =>
            order.iddata_order === editingOrder.iddata_order
              ? editingOrder
              : order
          )
        );
        getAllDataOrder();
        setIsEditFormVisible(false);
        setEditingOrder(null);
      }
    } catch (error) {}
  };

  const backToDataProject = async () => {
    navigate("/dataproject");
  };

  const cancelOrderForm = async () => {
    toast.error(
      "Anda membatalkan order, silahkan kembali ke halaman Data Project dan klik Go to Detail jika ingin melakukan order"
    );
    setOrder((prev) => ({
      ...prev,
      namaProject: "",
      tahapan: "",
    }));
    setOrderForm(false);
    getAllDataOrder();
    navigate("/order", { replace: true, state: null });
  };

  const openEditForm = async (order) => {
    setOrder((prev) => ({
      ...prev,
      namaProject: "",
      tahapan: "",
    }));
    setEditingOrder(order);
    setIsEditFormVisible(true);
  };

  const cancelEdit = async () => {
    setIsEditFormVisible(false);
    setEditingOrder(null);
  };

  const submitToRiwayat = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = dayjs().format("YYYY/MM/DD");
      const riwayatOrder = allDataOrder.map(
        ({ item_pekerjaan, nama_project, qty_order }) => ({
          itemOrdered: item_pekerjaan,
          lokasiPenanaman: nama_project,
          qtyOrdered: qty_order,
          tanggalOrder: formattedDate,
        })
      );
      const response = await axios.post(
        "http://localhost:3000/api/riwayat/add-riwayat",
        riwayatOrder
      );
      if (response.data.success) {
        toast.success(
          response.data.message || "Riwayat Berhasil Ditambahkan !"
        );
        const request = await axios.delete(
          "http://localhost:3000/api/order/delete-all-order"
        );
        setAllDataOrder([]);
        setFilteredOrder([]);
      } else {
        toast.error(response.data.message || "Gagal Menambahkan Riwayat!");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const dataToDisplay = filteredOrder.length > 0 ? filteredOrder : allDataOrder;

  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);

  const currentData = dataToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showDeleteConfirmation = (order) => {
    Swal.fire({
      title: `Yakin ingin menghapus "${order.item_pekerjaan}"?`,
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDataOrder(order.iddata_order);
        Swal.fire("Terhapus!", "Order berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="d-flex order">
      <div className="p-2 sidebar d-flex">
        <Sidebar />
      </div>
      <div className="p-2 table-order">
        <h1>Order</h1>
        <SearchBar
          placeholder="Search order by item pekerjaan..."
          onSearch={searchDataOrder}
        />
        {orderForm ? (
          <form onSubmit={handleSubmit} className="input-group mt-3">
            <input
              type="text"
              name="itemPekerjaan"
              value={order.itemPekerjaan}
              onChange={handleInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Item Pekerjaan"
              required
            />
            <input
              type="text"
              name="namaProject"
              value={order.namaProject}
              onChange={handleInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Nama Project"
              required
              readOnly
            />
            <input
              type="text"
              name="volumeBq"
              value={order.volumeBq}
              onChange={handleInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Volume BQ"
              required
            />
            <input
              type="text"
              name="qtyReject"
              value={order.qtyReject}
              onChange={handleInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="QTY Reject"
              required
            />
            <input
              type="text"
              name="qtyOrder"
              value={order.qtyOrder}
              onChange={handleInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="QTY Order"
              required
            />
            <input
              type="date"
              name="tanggalChecklist"
              value={formatDateForInput(order.tanggalChecklist)}
              onChange={handleInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Tanggal Checklist"
              required
            />
            <select
              name="tahapan"
              value={order.tahapan}
              onChange={handleInputChange}
              className="form-control bg-body-secondary border-black border-2"
              required
              disabled
            >
              <option value="">Pilih Tahapan</option>
              <option value="proses penanaman">Proses Penanaman</option>
              <option value="st 1">ST 1</option>
              <option value="st 2 ke 1">ST 2 ke 1</option>
              <option value="st 2 ke 2">ST 2 ke 2</option>
            </select>
            <input type="hidden" name="tahapan" value={order.tahapan} />
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              onClick={cancelOrderForm}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="my-3">
            <p>
              Notes : Jika ingin melakukan order harus melalui halaman Data
              Project dan klik Go to Detail
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => backToDataProject()}
            >
              Ke Halaman Data Project
            </button>
          </div>
        )}
        {isEditFormVisible && editingOrder && (
          <form onSubmit={handleEditSubmit} className="input-group mt-3">
            <input
              type="text"
              name="item_pekerjaan"
              value={editingOrder.item_pekerjaan}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Item Pekerjaan"
              required
            />
            <input
              type="text"
              name="nama_project"
              value={editingOrder.nama_project}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="nama_project"
              required
              readOnly
            />
            <input
              type="text"
              name="volume_bq"
              value={editingOrder.volume_bq}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Volume BQ"
              required
            />
            <input
              type="text"
              name="qty_reject"
              value={editingOrder.qty_reject}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="QTY Reject"
              required
            />
            <input
              type="text"
              name="qty_order"
              value={editingOrder.qty_order}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="QTY Order"
              required
            />
            <input
              type="date"
              name="tanggal_checklist"
              value={formatDateForInput(editingOrder.tanggal_checklist)}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              placeholder="Tanggal Checklist"
              required
            />
            <select
              name="tahapan"
              value={editingOrder.tahapan}
              onChange={handleEditInputChange}
              className="form-control bg-body-secondary border-black border-2"
              required
              disabled
            >
              <option value="">Pilih Tahapan</option>
              <option value="proses penanaman">Proses Penanaman</option>
              <option value="st 1">ST 1</option>
              <option value="st 2 ke 1">ST 2 ke 1</option>
              <option value="st 2 ke 2">ST 2 ke 2</option>
            </select>
            <input type="hidden" name="tahapan" value={order.tahapan} />
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
                <th scope="col">Item Pekerjaan</th>
                <th scope="col">Nama Project</th>
                <th scope="col">Volume BQ</th>
                <th scope="col">QTY Reject</th>
                <th scope="col">QTY Order</th>
                <th scope="col">Tanggal Checklist</th>
                <th scope="col">Tahapan</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentData.length > 0 ? (
                currentData.map((order, index) => (
                  <tr key={order.iddata_order || index}>
                    <th className="text-center" scope="row">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </th>
                    <td className="text-center text-break">
                      {order.item_pekerjaan}
                    </td>
                    <td className="text-break">{order.nama_project}</td>
                    <td className="text-center text-break">
                      {order.volume_bq}
                    </td>
                    <td className="text-center text-break">
                      {order.qty_reject}
                    </td>
                    <td className="text-center text-break">
                      {order.qty_order}
                    </td>
                    <td className="text-center text-break">
                      {formatDateDMY(order.tanggal_checklist)}
                    </td>
                    <td className="text-center text-break">{order.tahapan}</td>
                    <td className="text-center d-flex flex-grow-1 flex-column gap-2 justify-content-center text-break">
                      <button
                        className="btn btn-primary"
                        onClick={() => openEditForm(order)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          showDeleteConfirmation(order);
                        }}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
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
        {filteredOrder.length > 0 || allDataOrder.length > 0 ? (
          <div className="text-center">
            <button
              className="btn btn-info btn-lg"
              type="submit"
              onClick={submitToRiwayat}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              className="btn btn-info btn-lg"
              type="submit"
              onClick={submitToRiwayat}
              disabled
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
