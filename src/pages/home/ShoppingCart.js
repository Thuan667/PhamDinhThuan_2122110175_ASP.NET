import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import { Card, Col, Container, Row, Form, Button } from 'react-bootstrap';
import { Api } from '../api/Api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            loading: false,
            subtotal: 0,
            total: 0,
            cartList: [],
            selectedList: [],
            redirectToLogin: false,
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.calcTotal = this.calcTotal.bind(this);

        this.handleCheckout = this.handleCheckout.bind(this); // Bind handleCheckout
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.UserId || null;
                if (userId) {
                    this.setState({ userId });
                    this.getShoppingCartList(userId);
                    const localCart = localStorage.getItem('cartList');
                    if (localCart) {
                        localStorage.removeItem('cartList');
                    }
                }
            } catch (error) {
                console.error("Lỗi giải mã token:", error);
            }
        } else {
            // Nếu chưa đăng nhập, không hiển thị giỏ hàng
            this.setState({ redirectToLogin: true });
        }
    }

    getShoppingCartList(userId) {
        this.setState({ loading: true });
        axios
            .get(`${Api}/Cart/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then((response) => {
                // Log dữ liệu trả về từ API
                console.log("API Response:", response);
                console.log("Cart Data:", response.data);  // Log dữ liệu trả về
    
                // Kiểm tra nếu có giỏ hàng, lấy cartId từ items trong giỏ hàng đầu tiên
                const allItems = response.data.flatMap(cart => cart.items || []);
                const cartId = response.data.length > 0 && response.data[0].items.length > 0 ? response.data[0].items[0].cartId : null;
                const cartItemId = response.data.length > 0 && response.data[0].items.length > 0 ? response.data[0].items[0].cartItemId : null;
                // Log cartId để kiểm tra
                console.log("Cart ID:", cartId);
                console.log("CartItemId ID:", cartItemId);
                // Cập nhật state với các items và cartId
                this.setState({
                    cartList: allItems,
                    cartId: cartId,
                    cartItemId: cartItemId, // Lưu cartId vào state
                    loading: false
                });
    
                // Cập nhật số lượng giỏ hàng
                this.props.updateCartCount(allItems.length);
    
                // Tính tổng tiền (hoặc bất kỳ tính toán nào khác)
                this.calcTotal(this.state.selectedList);
            })
            .catch((error) => {
                console.error('Error fetching cart:', error);
                this.setState({ loading: false });
            });
    }
    
    
    
    

    handleDelete(e, cartItemIdToDelete) {
        const { cartId } = this.state;
        const token = localStorage.getItem('token');
    
        console.log("Token:", token);
        console.log("Cart ID from state:", cartId);
        console.log("CartItemId to delete:", cartItemIdToDelete);
    
        if (token && cartId) {
            axios
                .delete(`${Api}/Cart/cart/${cartId}/item/${cartItemIdToDelete}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    console.log("Response from server:", response);
                    
                 
    
                    // Cách 2: Load lại trang (nếu muốn)
                     window.location.reload(); 
                })
                .catch((error) => {
                    console.error('Error deleting item from cart:', error);
                });
        } else {
            console.log('No cartId or user is not logged in');
        }
    }
    
    
    
    
    
    
    
    
    
    

    handleChange(e) {
        const { id, type, className, value } = e.target;
        const itemId = parseInt(id);

        if (type === 'checkbox') {
            let updatedSelectedList = [...this.state.selectedList];

            if (id === '0') {
                if (this.state.selectedList.length === this.state.cartList.length) {
                    updatedSelectedList = [];
                } else {
                    updatedSelectedList = this.state.cartList.map((item) => item.id);
                }
            } else {
                if (updatedSelectedList.includes(itemId)) {
                    updatedSelectedList = updatedSelectedList.filter((item) => item !== itemId);
                } else {
                    updatedSelectedList.push(itemId);
                }
            }

            this.setState({
                selectedList: updatedSelectedList,
            }, () => {
                this.calcTotal(this.state.selectedList);
            });
        } else {
            let newQuantity = this.state.cartList.find(item => item.id === itemId)?.quantity || 1;

            if (className === 'qty-up') {
                newQuantity += 1;
            } else if (className === 'qty-down') {
                newQuantity = Math.max(newQuantity - 1, 1);
            } else if (type === 'number') {
                newQuantity = parseInt(value);
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                }
            }

            const updatedCartList = this.state.cartList.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );

            this.setState({ cartList: updatedCartList }, () => {
                if (localStorage.getItem('token') && this.state.userId) {
                    const updatedItem = this.state.cartList.find(item => item.id === itemId);
                    if (updatedItem) {
                        console.log('Updating quantity for ID:', itemId, 'to:', updatedItem.quantity);
                        axios
                            .put(`${Api}/product/cart-list/${itemId}`, { quantity: updatedItem.quantity }, {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                            })
                            .then(() => {
                                this.calcTotal(this.state.selectedList);
                            })
                            .catch((error) => {
                                console.error('Error updating quantity:', error);
                            });
                    }
                } else {
                    localStorage.setItem('cartList', JSON.stringify(updatedCartList));
                    this.getGuestShoppingCartList(updatedCartList);
                    this.calcTotal(this.state.selectedList);
                }
            });
        }
    }

    calcTotal(selectedList) {
        let subtotal = 0;

        this.state.cartList.forEach((item) => {
            if (selectedList.includes(item.id)) {
                subtotal += item.price * item.quantity;
            }
        });

        const formattedSubtotal = parseFloat(subtotal.toFixed(2));

        this.setState({
            subtotal: formattedSubtotal,
            total: formattedSubtotal,
        });

        localStorage.setItem('subtotal', formattedSubtotal);
        localStorage.setItem('total', formattedSubtotal);
    }

    handleCheckout(e) {
        const id = parseInt(e.target.id);
        let selectedCheckout = [];
    
        if (id !== 0) {
            selectedCheckout = [id];
        } else {
            selectedCheckout = this.state.selectedList;
        }
    
        localStorage.setItem('selectedList', JSON.stringify(selectedCheckout));
        localStorage.setItem('checkoutTotal', this.state.total.toFixed(2));
        // Chuyển hướng người dùng đến trang thanh toán
        this.props.navigate('/checkout'); // Sử dụng navigate để chuyển trang
    }
    

    render() {
        const { loading, cartList, subtotal, total } = this.state;
        if (this.state.redirectToLogin) {
            return (
                <Container className="text-center mt-5">
                    <h4>Bạn cần đăng nhập để xem giỏ hàng</h4>
                </Container>
            );
        }
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            );
        }

        return (
            <Container className="mt-5 mb-5">
                <Row>
                    <Col md={8}>
                        <Card className="mb-3">
                            <Card.Body>
                                <h5 className="mb-3">Giỏ hàng của bạn</h5>
                                {cartList.length === 0 ? (
                                    <p>Giỏ hàng trống</p>
                                ) : (
                                    <>
                                        <Form.Check
                                            type="checkbox"
                                            id="0"
                                            label="Chọn tất cả"
                                            onChange={this.handleChange}
                                            checked={this.state.selectedList.length === cartList.length && cartList.length > 0}
                                            className="mb-3"
                                        />
                                      {cartList.map((item, index) => (
  <Card key={index} className="mb-3">
    <Row className="g-0 align-items-center">
      <Col md={2}>
        <img                           src={`/img/${item.image}`}
 alt={item.productName} className="img-fluid rounded-start" />
      </Col>
      <Col md={6}>
        <Card.Body>
          <Card.Title>{item.productName}</Card.Title>
          <Card.Text>Số lượng: {item.quantity}</Card.Text>
          <Card.Text>Giá: {item.price}đ</Card.Text>
        </Card.Body>
      </Col>
      <Col md={4}>
        <Button variant="danger" onClick={(e) => this.handleDelete(e, item.cartItemId)}>
          Xoá
        </Button>
      </Col>
    </Row>
  </Card>
))}

                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <h5 className="mb-3">Tổng cộng</h5>
                                <Card className="mt-4 p-3 shadow" style={{ borderLeft: '5px solid #f44336' }}>
  <h5 className="text-end">Tạm tính: <strong style={{ color: '#f44336' }}>{subtotal.toLocaleString()}đ</strong></h5>
  <h4 className="text-end">Tổng cộng: <strong style={{ color: '#f44336' }}>{total.toLocaleString()}đ</strong></h4>
  <div className="text-end mt-3">
    <Button variant="danger" size="lg" onClick={this.handleCheckout}>Đặt hàng</Button>
  </div>
</Card>

                                {/* {this.state.cartList.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant="outline-primary"
                                        size="sm"
                                        className="mt-2 w-100"
                                        id={item.id}
                                        onClick={this.handleCheckout}
                                        disabled={!this.state.selectedList.includes(item.id)}
                                    >
                                        Thanh toán sản phẩm này
                                    </Button>
                                ))} */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user_data,
});

const mapDispatchToProps = (dispatch) => ({
    updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
});

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let navigate = useNavigate();
        return (
            <Component
                {...props}
                navigate={navigate}
            />
        );
    }

    return ComponentWithRouterProp;
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShoppingCart));