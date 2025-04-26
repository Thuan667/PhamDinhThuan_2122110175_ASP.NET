import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Api } from "../../api/Api";
import Swal from "sweetalert2";

// Hàm lấy token từ localStorage
const getToken = () => {
    return localStorage.getItem("token"); // hoặc "accessToken" tùy theo bạn lưu token tên gì
};

const User = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    // Lấy danh sách người dùng
    const getUsers = async () => {
        try {
            const response = await axios.get(`${Api}/user`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng: ", error);
        }
    };
    useEffect(() => {
        getUsers();
    }, []);

    // Xóa người dùng
    const deleteUser = async (userId) => {
        const isConfirm = await Swal.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn nguyên điều này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!",
        });

        if (!isConfirm.isConfirmed) return;

        try {
            await axios.delete(`${Api}/user/${userId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            Swal.fire("Đã xóa!", "Người dùng đã bị xóa.", "success").then(() => {
                getUsers();
            });
        } catch (error) {
            console.error("Lỗi khi xóa người dùng: ", error);
            Swal.fire("Lỗi!", "Không thể xóa người dùng.", "error");
        }
    };

    // Sửa người dùng
    const editUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Cập nhật người dùng
    const updateUser = async (e) => {
        e.preventDefault();
    
        if (!newPassword) {
            Swal.fire("Lỗi!", "Vui lòng nhập mật khẩu mới.", "error");
            return;
        }
    
        if (!selectedUser || !selectedUser.userId) {
            Swal.fire("Lỗi!", "Không tìm thấy người dùng để cập nhật.", "error");
            return;
        }
    
        try {
            await axios.put(`${Api}/user/${selectedUser.userId}`, {
                username: selectedUser.username,
                email: selectedUser.email,
                password: newPassword,
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
    
            Swal.fire("Thành công!", "Thông tin người dùng đã được cập nhật.", "success").then(() => {
                setShowModal(false);
                getUsers();
                setNewPassword(""); // clear mật khẩu sau khi update
            });
        } catch (error) {
            console.error("Lỗi cập nhật: ", error);
            Swal.fire("Lỗi!", "Không thể cập nhật người dùng.", "error");
        }
    };

    // Thêm người dùng mới
    const addUser = async (e) => {
        e.preventDefault();

        if (!newUser.username || !newUser.email || !newUser.password) {
            Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin!", "error");
            return;
        }

        const userWithRole = {
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role, // sửa từ roles: [newUser.role]
        };

        try {
            await axios.post(`${Api}/user`, userWithRole, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                }
            });
            Swal.fire("Thành công!", "Người dùng đã được thêm.", "success").then(() => {
                setShowAddModal(false);
                setNewUser({ email: "", username: "", password: "", role: "user" });
                getUsers();
            });
        } catch (error) {
            console.error("Lỗi thêm người dùng: ", error);
            Swal.fire("Lỗi!", "Không thể thêm người dùng.", "error");
        }
    };

    // Hiển thị vai trò
    const getRoleDisplayName = (role) => {
        switch (role) {
            case "admin":
                return "Quản trị viên";
            case "user":
                return "Người dùng";
            default:
                return "Không xác định";
        }
    };

    return (
        <div className="container-fluid">
            <div className="card shadow mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="m-0 font-weight-bold text-danger">Tất cả người dùng</h6>
                    <Button variant="danger" onClick={() => setShowAddModal(true)}>Thêm người dùng mới</Button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" cellSpacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th className="text-danger">ID</th>
                                    <th className="text-danger">Tên</th>
                                    <th className="text-danger">Email</th>
                                    <th className="text-danger">Password</th>
                                    <th className="text-danger">Vai trò</th>
                                    <th className="text-danger">Hành động</th>
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                                {users.length > 0 ? users.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>******</td>
                                        <td>{getRoleDisplayName(user.role)}</td>
                                        <td>
                                            <Button variant="info" onClick={() => editUser(user)}>Sửa</Button>{' '}
                                            <Button variant="danger" onClick={() => deleteUser(user.userId)}>Xóa</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6">Không có người dùng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal sửa người dùng */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa thông tin người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateUser}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên người dùng</Form.Label>
                            <Form.Control type="text" value={selectedUser?.username || ''} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={selectedUser?.email || ''} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Cập nhật</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal thêm người dùng */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm người dùng mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addUser}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên người dùng</Form.Label>
                            <Form.Control type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vai trò</Form.Label>
                            <Form.Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="user">Người dùng</option>
                              </Form.Select> </Form.Group> <Button variant="primary" type="submit">Thêm</Button> </Form> </Modal.Body> </Modal> </div> ); };

export default User;


