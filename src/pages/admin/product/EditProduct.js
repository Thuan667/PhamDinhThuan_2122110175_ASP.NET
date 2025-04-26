import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '../../api/Api';
import { Form, Button, Spinner } from 'react-bootstrap';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    // fetchProduct(id);
  }, [id]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Api}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setCategories(response.data);
      console.log("Categories:", response.data); // Kiểm tra dữ liệu trả về
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
      console.log("Brand:", response.data); // Kiểm tra dữ liệu trả về
    } catch (error) {
      console.error('Lỗi khi tải thương hiệu:', error);
    }
  };

  // const fetchProduct = async (id) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get(`${Api}/product/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const product = response.data;
  //     setCategoryId(product.categoryId);
  //     setProductName(product.productName);
  //     setBrandId(product.brandId);
  //     setPrice(product.price);
  //   } catch (error) {
  //     console.error('Lỗi khi tải sản phẩm:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      const response = await axios.put(`${Api}/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire('Thành công', 'Sản phẩm đã được cập nhật!', 'success');
      navigate('/admin/product');
    } catch (error) {
      Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-danger mb-4">Chỉnh sửa sản phẩm</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Chọn danh mục</Form.Label>
          <Form.Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Chọn thương hiệu</Form.Label>
          <Form.Select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            required
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand.brandId} value={brand.brandId}>
                {brand.brandName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá sản phẩm</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Chọn ảnh sản phẩm</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            'Cập nhật sản phẩm'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default EditProduct;
