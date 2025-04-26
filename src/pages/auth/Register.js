import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import {Api} from '../api/Api'
const Register = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShow = () => {
    setShow(true);
    setMessage('');
    setError('');
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    axios.post(`${Api}/user`, {
      username,
      email,
      password
    })
    .then((res) => {
      const newUser = res.data;
      setMessage(`Tạo người dùng thành công: ${newUser.username}`);
      setUsername('');
      setEmail('');
      setPassword('');
      setLoading(false);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    })
    .catch((err) => {
      setLoading(false);
      if (err.response?.data) {
        setError('Tạo người dùng thất bại: ' + JSON.stringify(err.response.data));
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    });
  };

  return (
    <>
      <Button onClick={handleShow} bsPrefix="auth" style={{ color: 'black' }}>
        <i className="fa fa-user-o" style={{ color: 'black' }}></i> Đăng Ký
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="auth-title">Người Dùng Đăng Ký</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <form className="auth" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                required
                className="form-control auth-input"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <i className="fa fa-user"></i>
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                required
                className="form-control auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="fa fa-envelope"></i>
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                required
                className="form-control auth-input"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="fa fa-lock"></i>
            </div>
            <button type="submit" className="submit btn btn-danger">
              {loading ? (
                <div className="align-middle">
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  <span> Đang Đăng Ký...</span>
                </div>
              ) : (
                <span>Đăng ký</span>
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Register;
