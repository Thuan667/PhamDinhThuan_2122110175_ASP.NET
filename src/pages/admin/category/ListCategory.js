import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { Api } from "../../api/Api";

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [addCategoryName, setAddCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);

  const openEditModal = (category) => {
    setEditCategoryId(category.categoryId); // sửa từ category.id
    setEditCategoryName(category.categoryName);
    setEditModalShow(true);
  };

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get(`${Api}/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Dữ liệu trả về từ API:", response.data);
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa danh mục này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
    });

    if (isConfirm.isConfirmed) {
      try {
        await axios.delete(`${Api}/category/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        Swal.fire("Đã xóa!", "Danh mục đã bị xóa.", "success");
        setCategories(categories.filter((category) => category.categoryId !== id));
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể xóa danh mục", "error");
      }
    }
  };

  const handleEditCategory = async () => {
    try {
      await axios.put(
        `${Api}/category/${editCategoryId}`,
        { categoryName: editCategoryName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire("Thành công!", "Danh mục đã được cập nhật", "success");
      setEditModalShow(false);
      setCategories(categories.map((category) =>
        category.categoryId === editCategoryId ? { ...category, categoryName: editCategoryName } : category
      ));
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể cập nhật danh mục", "error");
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(
        `${Api}/category`,
        { categoryName: addCategoryName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire("Thành công!", response.data.message, "success");
      setAddModalShow(false);
      fetchCategories();
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể thêm danh mục", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center text-danger mb-4 fw-bold">Danh Mục Sản Phẩm</h2>

      <div className="text-center mb-4">
        <Button variant="danger" className="rounded-pill px-4 py-2" onClick={() => setAddModalShow(true)}>
          + Thêm Danh Mục
        </Button>
      </div>

      <table className="table table-bordered">
        <thead className="table-danger">
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.categoryId}>
              <td>{index + 1}</td>
              <td className="text-danger">{category.categoryName}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(category)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.categoryId)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Thêm */}
      <Modal show={addModalShow} onHide={() => setAddModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Thêm Danh Mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục"
              value={addCategoryName}
              onChange={(e) => setAddCategoryName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalShow(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleAddCategory}>Thêm</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Chỉnh Sửa */}
      <Modal show={editModalShow} onHide={() => setEditModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Chỉnh Sửa Danh Mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cập nhật tên danh mục"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalShow(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleEditCategory}>Cập Nhật</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListCategory;
