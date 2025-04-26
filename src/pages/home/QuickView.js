import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Api } from "../api/Api";
import { jwtDecode } from 'jwt-decode'; // Correctly importing jwtDecode

function QuickView(props) {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [cartLoading, setCartLoading] = useState(false);

    // Lấy userId từ localStorage hoặc props nếu có
    const token = localStorage.getItem('token');
    let userId = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token); // Decode the JWT token
            console.log("Decoded token:", decodedToken);
            userId = decodedToken.UserId; // Assuming 'userId' is a part of the decoded token
        } catch (error) {
            console.error('Invalid token:', error);
            userId = null;
        }
    }
    console.log('UserId:', userId); // Kiểm tra xem userId đã được lấy thành công không
    const handleClose = () => {
        props.hideQuickView();
    };

    useEffect(() => {
        if (props.product) {
            setProduct(props.product);
            setLoading(false);
        }
    }, [props.showModal, props.product]);

    const handleAddToCart = async () => {
        console.log('🧪 Bấm nút thêm vào giỏ');
    
        if (!userId) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            console.log('⚠️ Không có userId');
            return;
        }
    
        setCartLoading(true);
    
        const cartData = {
            userId: userId,
            items: [
                {
                    productId: product.productId,
                    quantity: quantity,
                    price: product.price,
                    productName: "string",
                    image: "string"
                }
            ]
        };
    
        const token = localStorage.getItem('token'); // 🔑 Lấy token từ localStorage
    
        console.log('🛒 Đang gửi dữ liệu giỏ hàng:', cartData);
        console.log('🔐 Token:', token);
    
        try {
            const response = await axios.post(`${Api}/cart`, cartData, {
                headers: {
                    Authorization: `Bearer ${token}`, // ⬅️ Gửi token trong headers
                    'Content-Type': 'application/json' // 👈 rõ ràng loại content
                }
            });
    
            console.log('✅ Thêm giỏ hàng thành công:', response.data);
            toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);

        } catch (error) {
            console.error('❌ Lỗi khi thêm vào giỏ hàng:', error);
    
            if (error.response) {
                console.log('🔴 Server trả về lỗi:', error.response.data);
                toast.error(error.response.data.message || 'Thêm vào giỏ hàng thất bại.');
            } else if (error.request) {
                console.log('🟠 Không nhận được phản hồi từ server:', error.request);
                toast.error('Không kết nối được đến server.');
            } else {
                console.log('⚫ Lỗi không xác định:', error.message);
                toast.error('Có lỗi xảy ra.');
            }
        } finally {
            setCartLoading(false);
        }
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    return (
        <Modal size="lg" show={props.showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{product.productName || 'Sản phẩm không tìm thấy'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="spinner-container text-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <div className="row">
                        <ToastContainer />
                        {/* Hình ảnh sản phẩm */}
                        <div className="col-md-6 text-center">
                            <img
                                height="300"
                                width="300"
                                src={product.image ? `/img/${product.image}` : require('../../assets/img/hotdeal.png')}
                                alt={product.productName}
                                className="img-fluid rounded"
                            />
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="col-md-6">
                            <div className="product-details">
                                <h2 className="product-name">{product.productName}</h2>

                                {/* Giá */}
                                <div>
                                    {product.comparePrice && product.comparePrice > product.price ? (
                                        <h3 className="product-price">
                                            {product.price} VND{' '}
                                            <del className="product-old-price">{product.comparePrice} VND</del>
                                        </h3>
                                    ) : (
                                        <h3 className="product-price">{product.price} VND</h3>
                                    )}
                                    <span className="product-available">
                                        {product.productAvailable ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </div>

                                {/* Mô tả */}
                                <p className="mt-2">{product.description}</p>

                                {/* Số lượng */}
                                <div className="mt-3 d-flex align-items-center">
                                    <span className="me-2">Số lượng:</span>
                                    <div className="d-flex align-items-center border rounded px-2 py-1">
                                        <Button variant="outline-secondary" size="sm" onClick={decreaseQuantity} disabled={quantity === 1}>-</Button>
                                        <span className="mx-3">{quantity}</span>
                                        <Button variant="outline-secondary" size="sm" onClick={increaseQuantity}>+</Button>
                                    </div>
                                </div>

                                {/* Nút thêm vào giỏ hàng */}
                                <div className="add-to-cart mt-3">
                                    <Button
                                        className="add-to-cart-btn"
                                        variant="danger"
                                        onClick={handleAddToCart}>
                                     
                                     Thêm vào giỏ     <i className="fa fa-shopping-cart me-2"> </i>

                                    </Button>
                                </div>

                                {/* Nút chi tiết */}
                                <div className="add-to-cart mt-3">
                                    <Link to={`/products/${product.productId}`}>
                                        <Button className="add-to-cart-btn" variant="danger">
                                            Chi Tiết
                                        </Button>
                                    </Link>
                                </div>

                                {/* Danh mục */}
                                <ul className="product-links mt-3">
                                    <li>Danh mục:</li>
                                    <li><a href="#">{product.categoryName || 'Chưa rõ'}</a></li>
                                </ul>

                                {/* Chia sẻ */}
                                <ul className="product-links">
                                    <li>Chia sẻ:</li>
                                    <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                    <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                    <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                    <li><a href="#"><i className="fa fa-envelope"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default QuickView;
