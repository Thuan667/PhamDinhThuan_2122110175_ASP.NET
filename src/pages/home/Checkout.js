import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { Api } from '../api/Api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [cartList, setCartList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.UserId);
        }

        if (userId) {
            getShoppingCartList(userId);
        }
    }, [userId]);

    const getShoppingCartList = (userId) => {
        setLoading(true);
        axios
            .get(`${Api}/Cart/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then((response) => {
                const allItems = response.data.flatMap(cart => cart.items || []);
                setCartList(allItems);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching cart:', error);
                setLoading(false);
            });
    };

    const handleCheckout = async () => {
        if (!receiverName || !receiverPhone || !shippingAddress) {
            alert('Vui lòng nhập đầy đủ thông tin nhận hàng.');
            return;
        }

        if (!cartList || cartList.length === 0) {
            alert('Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm vào giỏ.');
            return;
        }

        const orderDetails = cartList.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price
        }));

        const orderData = {
            userId: userId,
            orderDate: new Date().toISOString(),
            receiverName,
            receiverPhone,
            shippingAddress,
            orderDetails
        };

        try {
            const response = await axios.post(`${Api}/order/with-details`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            alert('Đặt hàng thành công!');
            localStorage.removeItem('cartList');
            navigate('/');
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            alert('Đã xảy ra lỗi khi đặt hàng.');
        }
    };

    return (
        <Container style={{ paddingTop: '30px' }}>
            <h2 style={{ color: 'red', fontWeight: 'bold' }}>Thông tin nhận hàng</h2>
            <Form>
                <Form.Group controlId="receiverName" className="mb-3">
                    <Form.Label style={{ color: 'red' }}>Họ tên người nhận</Form.Label>
                    <Form.Control
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        style={{ borderColor: 'red' }}
                    />
                </Form.Group>

                <Form.Group controlId="receiverPhone" className="mb-3">
                    <Form.Label style={{ color: 'red' }}>Số điện thoại</Form.Label>
                    <Form.Control
                        type="text"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        style={{ borderColor: 'red' }}
                    />
                </Form.Group>

                <Form.Group controlId="shippingAddress" className="mb-4">
                    <Form.Label style={{ color: 'red' }}>Địa chỉ giao hàng</Form.Label>
                    <Form.Control
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        style={{ borderColor: 'red' }}
                    />
                </Form.Group>

                <Button
                    variant="danger"
                    onClick={handleCheckout}
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Đang xử lý...
                        </>
                    ) : (
                        'Đặt hàng'
                    )}
                </Button>
            </Form>

            <hr style={{ margin: '30px 0', borderColor: 'red' }} />

            <h4 style={{ color: 'red' }}>Giỏ hàng</h4>
            <ul style={{ paddingLeft: 0 }}>
                {cartList.length === 0 ? (
                    <p style={{ color: 'gray' }}>Giỏ hàng của bạn trống.</p>
                ) : (
                    cartList.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '20px',
                                border: '1px solid red',
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: '#fff5f5'
                            }}
                        >
                            {item.image && (
                                <img
                                    src={`/img/${item.image}`}
                                    alt={item.productName}
                                    style={{ width: '60px', height: '60px', marginRight: '15px', borderRadius: '8px', border: '1px solid red' }}
                                />
                            )}
                            <div>
                                <div style={{ fontWeight: 'bold', color: '#c00000' }}>{item.productName}</div>
                                <div>Số lượng: <span style={{ color: 'red' }}>{item.quantity}</span></div>
                                <div>Giá: <span style={{ color: 'red' }}>{item.price} VND</span></div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </Container>
    );
};

export default Checkout;
