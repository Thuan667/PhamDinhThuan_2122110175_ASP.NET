import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api/Api';
import { Form, Button, Spinner } from 'react-bootstrap';

const CreateProduct = () => {
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Api}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
      console.log('Danh mục:', response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Api}/brand`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(response.data);
      console.log('Thương hiệu:', response.data);
    } catch (error) {
      console.error('Lỗi khi tải thương hiệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Dữ liệu sẽ gửi:", {
      categoryId,
      productName,
      brandId,
      price,
      image
    });

    const formData = new FormData();
    formData.append('categoryId', categoryId);
    formData.append('productName', productName);
    formData.append('brandId', brandId);
    formData.append('price', price);
    if (image) {
      formData.append("image", image); // đây là file object
    }

    try {
      const token = localStorage.getItem('token');
      console.log("Token gửi:", token); // Kiểm tra xem token có hợp lệ không

      const response = await axios.post(`${Api}/product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Phản hồi từ API:", response); // Xem phản hồi từ API
      Swal.fire('Thành công', 'Sản phẩm đã được thêm!', 'success');
      navigate('/admin/product');
    } catch (error) {
      console.error("Lỗi chi tiết:", error); // In lỗi chi tiết
      Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-danger mb-4">Thêm sản phẩm</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label className="text-danger">Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-danger">Danh mục</Form.Label>
          <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
  <Form.Label className="text-danger">Thương hiệu</Form.Label>
  <Form.Select value={brandId} onChange={(e) => setBrandId(e.target.value)} required>
    <option value="">-- Chọn thương hiệu --</option>
    {brands.map((brand) => (
      <option key={brand.brandId} value={brand.brandId}> {/* Đảm bảo giá trị truyền là brandId */}
        {brand.brandName}
      </option>
    ))}
  </Form.Select>
</Form.Group>


        <Form.Group className="mb-3">
          <Form.Label className="text-danger">Giá</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-danger">Ảnh sản phẩm</Form.Label>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
        </Form.Group>

        <Button variant="danger" type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Thêm sản phẩm'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateProduct;
