import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api } from './../api/Api';
import { toast } from 'react-toastify';
import ProductItem from './ProductItem';
import QuickView from '../home/QuickView';

const ProductPage = ({ title, updateWishlistCount }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // Cho QuickView
  const [showModal, setShowModal] = useState(false);

  const getCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${Api}/category`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data || [];
      setCategories(data);
      if (data.length > 0 && currentCategory === null) {
        setCurrentCategory(data[0].categoryId);
      }
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error);
      toast.error('Không thể tải danh mục.');
    }
  };

  const getProducts = async (categoryId, page) => {
    if (!categoryId) return toast.error("Danh mục không hợp lệ.");
  
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = `${Api}/product/GetProductByCategoryId/${categoryId}?page=${page}`;
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Kiểm tra mã trạng thái của phản hồi
      if (res.status === 404 || !res.data || res.data.length === 0) {
        setProducts([]);
        toast.info("Không có sản phẩm trong danh mục này.");
        return;
      }
  
      if (Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
        setTotalPages(Math.ceil(res.data.length / 8));
      } else {
        setProducts([]);
        toast.info("Không có sản phẩm trong danh mục này.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Lỗi khi tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (currentCategory !== null) {
      // Khi thay đổi danh mục, reset trang về 0 và lấy sản phẩm
      getProducts(currentCategory, page);
    }
  }, [currentCategory, page]);

  const handleCategoryChange = (e, id) => {
    e.preventDefault();
    setCurrentCategory(id);
    setPage(0); // Reset trang khi thay đổi danh mục
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseQuickView = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    if (page > 0) {
      pages.push(
        <button key="prev" className="btn btn-sm btn-light mx-1" onClick={() => setPage(page - 1)}>
          &laquo;
        </button>
      );
    }

    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm ${i === page ? 'btn-danger' : 'btn-light'} mx-1`}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    if (page < totalPages - 1) {
      pages.push(
        <button key="next" className="btn btn-sm btn-light mx-1" onClick={() => setPage(page + 1)}>
          &raquo;
        </button>
      );
    }

    return <div className="text-center mt-3">{pages}</div>;
  };

  return (
    <div className="section">
      <div className="container">
        <div className="col-md-12">
          <div className="section-title">
            <h3 className="title">{title}</h3>
            <div className="section-nav">
              <ul className="section-tab-nav tab-nav">
                {categories.map((cat) => (
                  <li key={cat.categoryId} className={cat.categoryId === currentCategory ? 'active' : ''}>
                    <a href="#" onClick={(e) => handleCategoryChange(e, cat.categoryId)}>
                      {cat.categoryName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

                <div className="row">
          {loading ? (
            <div className="col-12 text-center">Đang tải sản phẩm...</div>
          ) : products.length > 0 ? (
            products.slice(page * 8, (page + 1) * 8).map((product) => (
              <ProductItem
                key={product.productId}
                product={product}
                onWishlist={() => updateWishlistCount(product.productId)}
                onQuickView={handleQuickView}
              />
            ))
          ) : (
            <div className="col-12 text-center">Không có sản phẩm trong danh mục này.</div>
          )}
        </div>



        {renderPagination()}

        {selectedProduct && (
          <QuickView
            showModal={showModal}
            product={selectedProduct}
            hideQuickView={handleCloseQuickView}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
