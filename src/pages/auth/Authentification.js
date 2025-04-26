import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from 'react-router-dom';

const Authentification = () => {
  const [redirect, setRedirect] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user_data); // Dùng useSelector để lấy user từ Redux

  // Kiểm tra thông tin người dùng trong localStorage khi component được mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      dispatch({ type: "USER", value: user });  // Lưu dữ liệu vào Redux
    }
  }, [dispatch]);

  // Đăng xuất người dùng
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("cartList");
    console.log("Đã xóa cartList khỏi localStorage");
    dispatch({ type: "REMOVE_USER" });
    dispatch({ type: "CART_COUNT", value: 0 });
    dispatch({ type: "WISHLIST_COUNT", value: 0 });
    navigate('/');
  };

  // Xử lý click trên các mục trong Dropdown
  const handleClick = (e) => {
    switch (e.target.id) {
      case "0":
        setRedirect("admin");
        break;
      case "1":
        setRedirect("my-account");
        break;
      case "2":
        setRedirect("order");
        break;
      case "3":
        logout();
        break;
      default:
        break;
    }
  };

  // Render giao diện người dùng hoặc form đăng nhập/đăng ký
  if (redirect) {
    return <Navigate to={`/${redirect}`} replace />;
  }

  return reduxUser && reduxUser.username ? (
    <li>
      <Dropdown>
        <Dropdown.Toggle variant="toggle" id="dropdown-basic">
          <i className="fa fa-user-o" style={{ color: "black" }}></i>
          <span style={{ color: "red" }}>
            <strong>{reduxUser.username}</strong> {/* Hiển thị tên người dùng từ Redux */}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu onClick={handleClick}>
          {reduxUser.role && reduxUser.role === "admin" && (
            <Dropdown.Item id="0">Quản Trị</Dropdown.Item>
          )}
          <Dropdown.Item id="1">Tài Khoản của tôi</Dropdown.Item>
          <Dropdown.Item id="2">Quản lý đơn hàng</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item id="3">
            <i className="fa fa-sign-out" aria-hidden="true"></i> Đăng Xuất
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  ) : (
    <React.Fragment>
      <li>
        <Login />
      </li>
      <li>
        <Register />
      </li>
    </React.Fragment>
  );
};

export default Authentification;
