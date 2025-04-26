import React, { Component } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Api } from "../api/Api";
function withRouter(Component) {
    function ComponentWithRouterProps(props) {
        const params = useParams();
        return <Component {...props} params={params} />;
    }
    return ComponentWithRouterProps;
}
class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            loading: true,
            cartLoading: false,
            cartButtonInit: true,
            productId: "",
            product: "",
            stocks: [],
            selectedSize: "",
            selectedColor: "",
            cartCount: "",
            quantity: 1,
            avaibleQuantity: "",
            settings: {
                dots: true,
                arrows: false,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        };
    }
    getProduct(id) {
        this.setState({ loading: true });
        console.log("Đang lấy sản phẩm với ID:", id);
        const token = localStorage.getItem('token');
        axios
            .get(`${Api}/product/${id}`,{
                headers: { Authorization: `Bearer ${token}` }
              })
            .then((response) => {
                console.log("Lấy API thành công:", response);
                
                const stocks = Array.isArray(response.data.stocks) ? response.data.stocks : [];
    
                this.setState({
                    productId: id,
                    product: response.data,
                    stocks: stocks, // Thiết lập mảng rỗng nếu `stocks` không phải kiểu iterable
                    loading: false,
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error("Lỗi khi gọi API:", error);
            });
    }
    
    handleMouseLeave() {
        this.setState({ cartButtonInit: true });
    }
    handleWishlist(e) {
        e.preventDefault();
        if (!localStorage.getItem("token")) {
            this.props.showLogin();
        } else {
            axios
                .post(
                    `${Api}/product/wishlist`,
                    {
                        productId: e.target.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        this.props.updateWishlistCount(response.data);
                        this.props.showToast("thêm vào danh sách yêu thích");
                    }
                })
                .catch((error) => {
                    this.props.showToast("Sản phẩm đã tồn tại trong yêu thích");
                });
        }
    }
    componentDidMount() {
        const { productId } = this.props.params; // Accessing productId from params 
        this.getProduct(productId);
    }
    componentDidUpdate(prevProps) {
        const { productId } = this.props.params; // Accessing productId from params
        if (productId !== prevProps.params.productId) {
            this.getProduct(productId);
        }
    }
    render() {
        const { productId } = this.props.params; // Accessing productId from params
        const {
            loading,
            product,
            settings,
            avaibleQuantity,
            quantity,
            cartButtonInit,
            cartLoading,
            stocks,
            selectedSize,
            selectedColor,
        } = this.state;
        if (loading) {
            return <Spinner animation="border" />;
        }
        return (
            <div>
                <div id="breadcrumb" className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <ul className="breadcrumb-tree">
                                    <li><a href="\">Trang Chủ</a></li>                                   
                                    <li className="active">Tên sản phẩm ở đây</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal.Body>
                    <div className="section">
                        <div className="container">
                            <div className="row">
                            <div className="col-md-6 col-md-push-2">
  <div id="product-main-imgs">
    <div id="product-imgs">
      <div className="product-preview">
        <img
          src={product.image ? `/img/${product.image}` : require('../../assets/img/hotdeal.png')}
          alt={product.productName}
          style={{ width: '100%', maxWidth: '300px', height: 'auto', objectFit: 'cover' }}
        />
      </div>
    </div>
  </div>
</div>

<div className="col-md-5">
  <div className="product-details">
    <h2 className="product-name">{product.productName}</h2>
    <div>
      <div className="product-rating">
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star-o"></i>
      </div>
      <a className="review-link" href="#">10 Đánh giá(s) | Thêm đánh giá của bạn </a>
    </div>
    <div>
      <h3 className="product-price">
        {product.price - product.price * 0.1} VND
        {" "}
        <del className="product-old-price">{product.price} VND</del>
      </h3>
    </div>
    <p>Đây là mô tả sản phẩm mẫu. Nơi đây sẽ chứa thông tin chi tiết về sản phẩm...</p>

    <div className="product-options">   
    </div>

    <div className="add-to-cart">
      <div className="qty-label">
        Qty
        <div className="input-number">
          <input type="number" />
          <span className="qty-up">+</span>
          <span className="qty-down">-</span>
        </div>
      </div>
      <Button    className="add-to-cart-btn"
                                        variant="danger">Thêm vào giỏ <i className="fa fa-shopping-cart me-2"></i></Button>
    </div>
  </div>
</div>


                                        <ul className="product-btns">
                                            <li><a href="#"><i className="fa fa-heart-o"></i> thêm vào yêu thích</a></li>
                                            <li><a href="#"><i className="fa fa-exchange"></i> Thêm vào so sánh</a></li>
                                        </ul>

                                        <ul className="product-links">
                                            <li>Danh mục:</li>
                                            <li><a href="#">Tai Phone</a></li>
                                            <li><a href="#">Phụ Kiện</a></li>
                                        </ul>

                                        <ul className="product-links">
                                            <li>Chia sẻ:</li>
                                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                            <li><a href="#"><i className="fa fa-envelope"></i></a></li>
                                        </ul>

                                    </div>
                                </div>

                            </div>


                            <div className="col-md-12">
                                <div id="product-tab">
                                    <ul className="tab-nav">
                                        <li className="active"><a data-toggle="tab" href="#tab1">Mô tả</a></li>
                                        <li><a data-toggle="tab" href="#tab2">Chi Tiết</a></li>
                                        <li><a data-toggle="tab" href="#tab3">Đánh giá (3)</a></li>
                                    </ul>
                                </div>
                            </div>
                    
              

                </Modal.Body >
                <div className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="section-title text-center">
                                    <h3 className="title">Sản phẩm liên quan</h3>
                                </div>
                            </div>
                            <div className="col-md-3 col-xs-6">
                                <div className="product">
                                    <div id="product-imgs">
                                        <div className="product-img">
                                            <div className="product-label">
                                                <span className="new">NEW</span>
                                            </div>
                                        </div>
                                        <div className="product-preview">
                                            <img height="300" width="300" src={product.photo && `/img/${product.photo}` ? `/img/${product.photo}` : require('../../assets/img/hotdeal.png')} alt={product.name} />
                                        </div>
                                    </div>
                                    <div className="product-body">
                                        <p className="product-category">Danh mục</p>
                                        <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                        <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        <div className="product-rating">
                                        </div>
                                        <div className="product-btns">
                                            <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">Thêm vào yêu thích</span></button>
                                            <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                                            <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                                        </div>
                                    </div>
                                    <div className="add-to-cart">
                                        <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 col-xs-6">
                                <div className="product">
                                    <div id="product-imgs">
                                        <div className="product-img">
                                            <div className="product-label">
                                                <span className="new">NEW</span>
                                            </div>
                                        </div>
                                        <div className="product-preview">
                                            <img height="300" width="300" src={product.photo && `/img/${product.photo}` ? `/img/${product.photo}` : require('../../assets/img/hotdeal.png')} alt={product.name} />
                                        </div>
                                    </div>
                                    <div className="product-body">
                                        <p className="product-category">Danh mục</p>
                                        <h3 className="product-name"><a href="#">Tên sản phẩm ở đây</a></h3>
                                        <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        <div className="product-rating">
                                        </div>
                                        <div className="product-btns">
                                            <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">Thêm vào yêu thích</span></button>
                                            <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                                            <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                                        </div>
                                    </div>
                                    <div className="add-to-cart">
                                        <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 col-xs-6">
                                <div className="product">
                                    <div id="product-imgs">
                                        <div className="product-img">
                                            <div className="product-label">
                                                <span className="new">NEW</span>
                                            </div>
                                        </div>
                                        <div className="product-preview">
                                            <img height="300" width="300" src={product.photo &&`/img/${product.photo}` ? `/img/${product.photo}`: require('../../assets/img/hotdeal.png')} alt={product.name} />
                                        </div>
                                    </div>
                                    <div className="product-body">
                                        <p className="product-category">Danh mục</p>
                                        <h3 className="product-name"><a href="#">Tên sản phẩm ở đây</a></h3>
                                        <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        <div className="product-rating">
                                        </div>
                                        <div className="product-btns">
                                            <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">add to wishlist</span></button>
                                            <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                                            <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                                        </div>
                                    </div>
                                    <div className="add-to-cart">
                                        <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 col-xs-6">
                                <div className="product">
                                    <div id="product-imgs">
                                        <div className="product-img">
                                            <div className="product-label">
                                                <span className="new">NEW</span>
                                            </div>
                                        </div>
                                        <div className="product-preview">
                                            <img height="300" width="300" src={product.photo && `/img/${product.photo}` ? `/img/${product.photo}` : require('../../assets/img/hotdeal.png')} alt={product.name} />
                                        </div>
                                    </div>
                                    <div className="product-body">
                                        <p className="product-category">Danh mục</p>
                                        <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                        <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        <div className="product-rating">
                                        </div>
                                        <div className="product-btns">
                                            <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">add to wishlist</span></button>
                                            <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                                            <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                                        </div>
                                    </div>
                                    <div className="add-to-cart">
                                        <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        );
    }
}
export default withRouter(ProductDetail);