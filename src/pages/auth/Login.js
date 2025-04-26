import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { Api } from '../api/Api';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay vì useHistory
import { useDispatch } from "react-redux";
function Login(props) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate(); // Khởi tạo navigate hook
  const dispatch = useDispatch();

    const handleClose = () => {
        props.hideLogin();
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
    
        try {
            const result = await axios.post(`${Api}/auth/login`, {
                username,
                password,
            });
    
            if (result.data && result.data.token) {
                const token = result.data.token;
                const role = result.data.role;  // Sửa từ 'Role' thành 'role'
    
                localStorage.setItem("token", token);
    
                console.log("✅ Đăng nhập thành công!");
                console.log("Token:", token);
                console.log("User:", { username, role });
    
                const wishlistCount = localStorage.getItem("wishlistCount") || 0;
                const cartCount = localStorage.getItem("cartCount") || 0;
    
                dispatch({ type: "CART_COUNT", value: cartCount });
                dispatch({ type: "WISHLIST_COUNT", value: wishlistCount });
    
                const user = {
                    username: result.data.username,
                    role: role,  // Sửa từ 'Role' thành 'role'
                };
                props.addUser(user);
                localStorage.setItem("user", JSON.stringify(user));
    
                handleClose();
                navigate('/');
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("❌ Login error", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    
      
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
    };

    return (
        <>
            <Button onClick={handleShow} bsPrefix="auth" style={{ color: 'black' }}>
                <i className="fa fa-sign-in" style={{ color: 'black' }}></i> Đăng Nhập
            </Button>

            <Modal show={show || props.showLogin} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="auth-title">Đăng Nhập</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="auth" onSubmit={handleSubmit}>
                        {error && (
                            <div className="form-alert">
                                <Alert variant="danger">
                                    Lỗi thông tin đăng nhập!
                                    <i className="fa fa-exclamation-triangle"></i>
                                </Alert>
                            </div>
                        )}
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                className="form-control auth-input"
                                name="username"
                                placeholder="Nhập Tên Người Dùng"
                                onChange={handleChange}
                            />
                            <i className="fa fa-user"></i>
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                required
                                className="form-control auth-input"
                                name="password"
                                placeholder="Nhập Mật Khẩu"
                                onChange={handleChange}
                            />
                            <i className="fa fa-lock"></i>
                        </div>
                        <button type="submit" className="submit btn btn-danger">
                            {loading ? (
                                <div className="align-middle">
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                    <span>Đang đăng nhập...</span>
                                </div>
                            ) : (
                                <span>Đăng Nhập</span>
                            )}
                        </button>
                    </form>
                    <div className="mt-3" style={styles.forgotPassword}>
                        <a href="/forgot-password" style={styles.link}>Quên mật khẩu?</a>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

const styles = {
    forgotPassword: {
        textAlign: 'right',
    },
    link: {
        textDecoration: 'none',
        color: '#007bff',
    }
};

const mapStateToProps = state => ({
    showLogin: state.show_login
});

const mapDispatchToProps = dispatch => ({
    addUser: user => dispatch({ type: 'USER', value: user }),
    hideLogin: () => dispatch({ type: 'LOGIN_CONTROL', value: false })
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
