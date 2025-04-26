import React from 'react'; 
import Button from 'react-bootstrap/Button';
import QucikView from '../home/QuickView';
const ProductItem = ({ product, onWishlist, onQuickView }) => {
  const handleAddToCart = () => {
    console.log("Thêm vào giỏ hàng: ", product.productId);
  };

  const handleQuickView = () => {
    console.log('Hiển thị nhanh sản phẩm: ', product);  // Kiểm tra thông tin sản phẩm trước khi gọi onQuickView
    if (onQuickView) {
        onQuickView(product);  // Truyền sản phẩm vào onQuickView
    }
};

  return (
    <div className="col-md-3 col-sm-6 col-xs-6 mb-4">
      <div className="product">
        <div className="product-img">
          <img
            src={`/img/${product.image}`} // Sử dụng đường dẫn hình ảnh của sản phẩm
            alt={product.productName}
            style={{ height: 300, objectFit: 'cover', width: '100%' }}
          />
        </div>
        <div className="product-body">
          <h3 className="product-name"><a href="#">{product.productName}</a></h3>
          <h4 className="product-price">
            <del className="product-old-price">{product.price} VND</del>
            {product.price} VND
          </h4>
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={
                product.review >= i + 1
                  ? 'fa fa-star'
                  : product.review > i
                  ? 'fa fa-star-half-o'
                  : 'fa fa-star-o'
              }></i>
            ))}
          </div>
          <div className="product-btns">
            {/* Kiểm tra onWishlist có tồn tại không trước khi gọi */}
            <Button bsPrefix="q" className="add-to-wishlist" onClick={() => onWishlist && onWishlist(product.productId)}>
              <i className="fa fa-heart-o"></i>
              <span className="tooltipp">Thêm vào yêu thích</span>
            </Button>
            {/* Kiểm tra onQuickView có tồn tại không trước khi gọi */}
            <Button bsPrefix="q" className="quick-view" onClick={handleQuickView}>
    <i className="fa fa-eye"></i>
    <span className="tooltipp">Xem nhanh</span>
</Button>
          </div>
        </div>
        <div className="add-to-cart">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <i className="fa fa-shopping-cart"></i> Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
