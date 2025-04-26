import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Api } from '../api/Api';
import { ToastContainer } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import ProductItem from '../products/ProductItem'; // Import component ProductItem
import { toast } from 'react-toastify';

const SearchResults = ({title, showQuickView, updateWishlistCount}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery || searchQuery.trim() === "") {
        setSearchResults([]);
        setLoading(false);
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.get(`${Api}/products/search`, {
          params: { name: searchQuery },
        });
  
        // Đảm bảo response.data là array, nếu không thì set rỗng
        if (Array.isArray(response.data)) {
          setSearchResults(response.data);
        } else {
          setSearchResults([]);
        }
  
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSearchResults();
  }, [searchQuery]);
  
  


const handleWishlist = async (productId) => {
		if (!localStorage.getItem('token')) {
			toast.error('Bạn cần đăng nhập để thêm vào yêu thích.');
			return;
		}

		try {
			const res = await axios.post(
				`${Api}/product/wishlist`,
				{ productId },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			updateWishlistCount(res.data);
			toast.success('Đã thêm vào danh sách yêu thích!');
		} catch (error) {
			if (error.response?.status === 409) {
				toast.info('Sản phẩm đã có trong danh sách yêu thích!');
			} else {
				toast.error('Lỗi khi thêm vào yêu thích!');
			}
		}
	};
  
  // Lọc các sản phẩm duy nhất
  const uniqueProducts = Array.from(new Set(searchResults.map(product => product.id)))
    .map(id => {
      return searchResults.find(product => product.id === id);
    });

  return (
    <div>
      <div className="section">
        <ToastContainer />
        <div className="container">
          <div className="col">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Kết quả tìm kiếm cho: {searchQuery}</h3>
              </div>
            </div>

            
            <div className="row">
            {loading ? (
						<div className="col-12 text-center">Đang tải sản phẩm...</div>
            ) : uniqueProducts.length > 0 ? (
              <>
                        {uniqueProducts.map((product) => (
                            <ProductItem 
                            key={product.id}
                            product={product}
                            onWishlist={handleWishlist}
									          onQuickView={showQuickView}
                             />
                        ))}
                      </>

            ) : (
              <div className="col-12 text-center">Không có sản phẩm nào.</div>
            )}
          </div>
          </div>


        </div>
      </div>
      <div style={{ paddingBottom: 50 }}></div>
    </div>
  );
};

export default SearchResults;
