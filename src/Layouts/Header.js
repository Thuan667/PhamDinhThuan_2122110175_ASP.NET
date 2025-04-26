import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Authentification from "../pages/auth/Authentification";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import { Api } from "../pages/api/Api";
import CartPreview from "../pages/home/CartPreview";
import ToastMessage from "../pages/home/ToastMessage";
import "../Layouts/css/Header.css";
import { jwtDecode } from 'jwt-decode'; // Correctly importing jwtDecode

const Header = (props) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("0");
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const getShoppingCartCount = async () => {
    try {
      const localCartList = JSON.parse(localStorage.getItem("cartList")) || [];
      const guestCount = localCartList.length;
  
      if (!localStorage.getItem("token")) {
        // Nếu là khách, số lượng giỏ hàng chỉ từ local
        setCartItemCount(guestCount);
        props.updateCartCount(guestCount);
        return;
      }
  
      // Nếu đã đăng nhập, lấy userId từ token
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.UserId;  // Giả sử 'userId' là tên trường trong token
  
      // Lấy số lượng giỏ hàng từ server
      const result = await axios.get(`${Api}/cart/count/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const serverCount = Number(result.data);
  
      setCartItemCount(serverCount);
      props.updateCartCount(serverCount);
    } catch (error) {
      console.error("Lỗi lấy số lượng giỏ hàng:", error);
    }
  };
  
  const getWishlistCount = async () => {
    try {
      if (!localStorage.getItem("token")) {
        // Nếu chưa đăng nhập, không cần gọi API
        setWishlistCount(0);
        props.updateWishlistCount(0);
        return;
      }
      const result = await axios.get(`${Api}/product/wishlist/count`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlistCount(result.data);
      props.updateWishlistCount(result.data);
    } catch (error) {
      console.error("Lỗi lấy số lượng yêu thích:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartList");
    console.log("Đã xóa cartList khỏi localStorage"); // Kiểm tra
    dispatch({ type: "REMOVE_USER" });
    dispatch({ type: "CART_COUNT", value: 0 });
    dispatch({ type: "WISHLIST_COUNT", value: 0 });
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    getShoppingCartCount();
    getWishlistCount();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getShoppingCartCount();
      getWishlistCount();
    } else {
      const localCartList = JSON.parse(localStorage.getItem("cartList")) || [];
      props.updateCartCount(localCartList.length);
      props.updateWishlistCount(0);
      if (localCartList.length === 0 && props.cartCount !== 0) {
        dispatch({ type: "CART_COUNT", value: 0 });
      }
    }
  }, [localStorage.getItem("token"),props.cartCount, props.wishlistCount]);

  return (
    <header>
      <ToastMessage />
      <div id="top-header" style={{ backgroundColor: "white" }}>
        <div className="container">
          <ul className="header-links">
            <li>
              <a href="tel:+84 000000000" style={{ color: "black" }}>
                <i className="fa fa-phone" style={{ color: "black" }}></i> 0343513090
              </a>
            </li>
            <li>
              <a href="mailto:Taithuan@gmail.com" style={{ color: "black" }}>
                <i className="fa fa-envelope-o" style={{ color: "black" }}></i> thuan@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/place/309+Đ.+Lê+Đức+Thọ,+Phường+17,+Gò+Vấp,+Hồ+Chí+Minh,+Vietnam"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black" }}
              >
                <i className="fa fa-map-marker" style={{ color: "black" }}></i>67/24 tang nhon phu
              </a>
            </li>
          </ul>
          <ul className="header-links">
            <li style={{ display: "flex", alignItems: "center" }}>
              <a
                href="/" // or wherever you want to link
                style={{ display: "flex", alignItems: "center", marginRight: "10px", color: "black" }}
              >
                <i className="fa fa-money" style={{ color: "black" }}></i> VND
              </a>
              <Authentification />
            </li>
          </ul>
        </div>
      </div>

      <div id="header" style={{ backgroundColor: "white" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="header-logo">
                <Link to="/">
                  <img src={require("../assets/img/logo-footer.webp")} alt="Company Logo" />
                </Link>
              </div>
            </div>

            <div className="col-md-6">
              <div className="header-search">
                <form onSubmit={handleSearch}>
                  <select
                    className="input-select"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="0">Tất cả sản phẩm</option>
                    <option value="1">Áo Quần</option>
                    <option value="2">Giày</option>
                    <option value="3">Thời Trang</option>
                    <option value="4">Phụ kiện</option>
                  </select>
                  <input
                    className="input"
                    placeholder="Tìm kiếm sản phẩm"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="search-btn" style={{ color: "black" }}>
                    Tìm kiếm
                  </button>
                </form>
              </div>
            </div>

            <div className="col-md-3">
              <div className="header-ctn">
                <div>
                  {/* <Link to="/wishlist" style={{ color: "black" }}>
                    <i className="fa fa-heart" style={{ color: "black" }}></i>
                    <span style={{ color: "black" }}>Yêu thích</span>
                    {props.wishlistCount > 0 && <div className="qty">{props.wishlistCount}</div>}
                  </Link> */}
                </div>
                <div className="dropdown">
                  <Link
                    className="dropdown-toggle"
                    to="/shopping-cart"
                    style={{ color: "black" }}
                  >
                    <i className="fa fa-shopping-cart" style={{ color: "black" }}></i>
                    <span style={{ color: "black" }}>Giỏ hàng</span>
                    {props.cartCount > 0 && <div className="qty">{props.cartCount}</div>}
                  </Link>
                  <CartPreview />
                </div>
                <div className="menu-toggle">
                  <a href="/" style={{ color: "black" }}>
                    <i className="fa fa-bars"></i>
                    <span>Menu</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  cartCount: state.cart_count,
  wishlistCount: state.wishlist_count,
  userData: state.user_data,
});

const mapDispatchToProps = (dispatch) => ({
  updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
  updateWishlistCount: (count) => dispatch({ type: "WISHLIST_COUNT", value: count }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);