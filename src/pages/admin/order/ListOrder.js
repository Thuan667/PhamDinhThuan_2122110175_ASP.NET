import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import {Api} from "../../api/Api"
const OrderList = () => {
  const [editOrder, setEditOrder] = useState({
    orderDate: '',
    totalAmount: '',
    userId: '',
    receiverName:'',
    receiverPhone:'',
    shippingAddress:''
  });
  const [orders, setOrders] = useState([]);
const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${Api}/Order`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
        console.log("order", response.data);
      } catch (error) {
        console.error('Có lỗi khi tải danh sách đơn hàng:', error);
      }
    };
  
    fetchOrders();
  }, []);
  

  const handleUpdateOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${Api}/Order/${selectedOrderId}`, editOrder, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Cập nhật lại danh sách đơn hàng sau khi sửa
      setOrders(prev =>
        prev.map(order =>
          order.orderId === selectedOrderId
            ? { ...order, ...editOrder, orderDate: new Date(editOrder.orderDate) }
            : order
        )
      );
  
      setEditModal(false);
    } catch (error) {
      console.error('Có lỗi khi cập nhật đơn hàng:', error);
    }
  };
  

  const handleEdit = (order) => {
    setSelectedOrderId(order.orderId);
    setEditOrder({
      orderDate: new Date(order.orderDate).toISOString().slice(0, 10),
      totalAmount: order.totalAmount,
      userId: order.userId || order.user?.userId,
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      shippingAddress: order.shippingAddress
    });
    setEditModal(true);
  };
  

  


  const fetchOrderDetail = async (orderId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${Api}/OrderDetail/orderId/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrderDetail(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Có lỗi khi tải chi tiết đơn hàng:', error);
    }
    setLoading(false);
  };
  
  const handleDelete = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${Api}/Order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(orders.filter(order => order.orderId !== orderId));
    } catch (error) {
      console.error('Có lỗi khi xóa đơn hàng:', error);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2 className="text-danger mb-4">Danh sách đơn hàng</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-danger">
          <tr>
            <th>Mã đặt hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Tổng tiền</th>
            <th>Người dùng</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">Không có đơn hàng nào</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{order.totalAmount.toLocaleString()}₫</td>
                <td>{order.user?.username}</td>
                <td>{order.user?.email}</td>
                <td>
                  <button 
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => fetchOrderDetail(order.orderId)}
                  >
                    Xem
                  </button>
                  <button
  className="btn btn-outline-danger btn-sm me-2"
  onClick={() => handleEdit(order)}
>
  Sửa
</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order.orderId)}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
  <Modal.Header closeButton className="bg-danger text-white">
    <Modal.Title>🧾 Chi tiết đơn hàng</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ backgroundColor: '#fff9f9' }}>
    {loading ? (
      <p className="text-danger">Đang tải thông tin chi tiết...</p>
    ) : orderDetail ? (
      <div>
        <h5 className="text-danger mb-3">🔖 Mã đơn hàng: {orderDetail[0]?.order?.orderId}</h5>
        <p><strong>📅 Ngày đặt hàng:</strong> {new Date(orderDetail[0]?.order?.orderDate).toLocaleString()}</p>
        <p><strong>💰 Tổng tiền:</strong> <span className="text-danger">{orderDetail[0]?.order?.totalAmount.toLocaleString()}₫</span></p>

        <div className="mt-4">
          <h6 className="text-danger border-bottom pb-1">🚚 Thông tin giao hàng</h6>
          <ul className="list-unstyled ms-3">
            <li><strong>👤 Họ tên người nhận:</strong> {orderDetail[0]?.order?.receiverName}</li>
            <li><strong>📞 Số điện thoại:</strong> {orderDetail[0]?.order?.receiverPhone}</li>
            <li><strong>🏠 Địa chỉ giao hàng:</strong> {orderDetail[0]?.order?.shippingAddress}</li>
          </ul>
        </div>

        <div className="mt-4">
          <h6 className="text-danger border-bottom pb-1">🛍️ Thông tin sản phẩm</h6>
          {orderDetail.map((item) => (
            <div
              key={item.orderDetailId}
              className="border rounded p-3 my-2"
              style={{ backgroundColor: "#fff5f5" }}
            >
              <div className="row align-items-center">
                <div className="col-md-3 text-center">
                  <img
                    src={`/img/${item.product.image}`}
                    alt={item.product.productName}
                    className="img-fluid rounded border"
                    style={{ maxHeight: "120px", objectFit: "contain" }}
                  />
                </div>
                <div className="col-md-9">
                  <p><strong>📦 Tên sản phẩm:</strong> {item.product.productName}</p>
                  <p><strong>💸 Giá:</strong> {item.unitPrice.toLocaleString()}₫</p>
                  <p><strong>🔢 Số lượng:</strong> {item.quantity}</p>
                  <p><strong>💲 Giá đơn vị:</strong> {item.unitPrice.toLocaleString()}₫</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-danger">Không có thông tin chi tiết đơn hàng.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="danger" onClick={() => setShowModal(false)}>Đóng</Button>
  </Modal.Footer>
</Modal>
<Modal show={editModal} onHide={() => setEditModal(false)} centered>
  <Modal.Header closeButton className="bg-danger text-white">
    <Modal.Title>✏️ Chỉnh sửa đơn hàng</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form>
      <div className="mb-3">
        <label className="form-label">📅 Ngày đặt hàng</label>
        <input
          type="date"
          className="form-control"
          value={editOrder.orderDate}
          onChange={(e) =>
            setEditOrder({ ...editOrder, orderDate: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">💰 Tổng tiền</label>
        <input
          type="number"
          className="form-control"
          value={editOrder.totalAmount}
          onChange={(e) =>
            setEditOrder({ ...editOrder, totalAmount: parseFloat(e.target.value) })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">👤 Mã người dùng</label>
        <input
          type="text"
          className="form-control"
          value={editOrder.userId}
          onChange={(e) =>
            setEditOrder({ ...editOrder, userId: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">👤 Tên người nhận</label>
        <input
          type="text"
          className="form-control"
          value={editOrder.receiverName}
          onChange={(e) =>
            setEditOrder({ ...editOrder, receiverName: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">👤 Số điện thoại</label>
        <input
          type="number"
          className="form-control"
          value={editOrder.receiverPhone}
          onChange={(e) =>
            setEditOrder({ ...editOrder, receiverPhone: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">👤 Địa chỉ người nhận</label>
        <input
          type="text"
          className="form-control"
          value={editOrder.shippingAddress}
          onChange={(e) =>
            setEditOrder({ ...editOrder, shippingAddress: e.target.value })
          }
        />
      </div>
    </form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setEditModal(false)}>Hủy</Button>
    <Button variant="danger" onClick={handleUpdateOrder}>Lưu thay đổi</Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default OrderList;
