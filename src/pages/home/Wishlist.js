import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'
import Pagination from 'react-js-pagination'
import { Api } from './../api/Api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class Wishlist extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: '',
            currentPage: 1,
            perPage: 0,
            total: 0,
            loading: true,
            wishlist: []
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.getWishlist(1)
        } else {
            this.props.showLogin()
            toast.error('Đăng nhập để xem danh mục yêu thích!')
        }
    }

    getWishlist(pageNumber) {
        this.setState({ loading: true })

        axios.get(`${Api}/product/wishlist?page=${pageNumber - 1}`, { // Spring Boot page bắt đầu từ 0
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(result => {
            const data = result.data
            this.setState({
                wishlist: data.content,
                currentPage: data.number + 1,
                perPage: data.size,
                total: data.totalElements,
                loading: false
            })
        }).catch(error => {
            console.error("Lỗi khi lấy wishlist: ", error)
            this.setState({ loading: false })
        })
    }

    componentDidUpdate() {
        if (this.props.user && this.props.user !== 'guest') {
            if (this.props.user.id !== this.state.userId) {
                this.setState({ userId: this.props.user.id })
                this.getWishlist(1)
            }
        }
    }

    handleClick(e) {
        let id = e.target.id
        this.props.showQuickView(id)
    }

    handleDelete(e) {
        let id = e.target.id
    
        axios.delete(`${Api}/product/wishlist/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            if (response.status === 200) {
                // Tổng số item sau khi xóa
                const newTotal = this.state.total - 1;
                const newPage = (newTotal <= (this.state.perPage * (this.state.currentPage - 1))) && this.state.currentPage > 1
                    ? this.state.currentPage - 1
                    : this.state.currentPage;
    
                this.setState({ total: newTotal }, () => {
                    this.getWishlist(newPage)
                });
    
                this.props.updateWishlistCount(response.data)
            }
        }).catch(error => {
            console.error("Lỗi khi xóa wishlist item: ", error)
            toast.error("Xảy ra lỗi khi xóa sản phẩm khỏi danh sách yêu thích!")
        });
    }
    

    render() {
        return (
            <React.Fragment>
                {/* <!-- BREADCRUMB --> */}
                <div id="breadcrumb" className="section">
                    <div className="container">
                        <ToastContainer />
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="breadcrumb-header">Yêu Thích</h3>
                                <ul className="breadcrumb-tree">
                                    <li><a href="#">Trang Chủ</a></li>
                                    <li className="active">Yêu thích</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- SECTION --> */}
                <div className="section">
                    <div className="container">
                        <div className="row">
                            <table id="wishlist">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}></th>
                                        <th style={{ width: '25%' }}>Tên sản phẩm</th>
                                        <th style={{ width: '20%', textAlign: "center" }}>Giá</th>
                                        <th style={{ width: '20%', textAlign: "center" }}>Tồn kho</th>
                                        <th style={{ width: '20%' }}></th>
                                        <th style={{ width: '10%' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {localStorage.getItem('token') ?
                                        this.state.loading ?
                                            <tr><td colSpan="6"><div className="spinner-container"><Spinner animation="border" /></div></td></tr> :
                                            this.state.wishlist.length > 0 ?
                                                this.state.wishlist.map(item => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <img height="100" width="100"
                                                                src={`/img/${item.productImage || 'hotdeal.png'}`}
                                                                alt={item.productName}
                                                            />
                                                        </td>
                                                        <td>
                                                            <h2 className="product-name">
                                                                <Link to={`/products/${item.productId}`}>
                                                                    {item.productName}
                                                                </Link>
                                                            </h2>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>{item.productPrice.toFixed(3)} VND</td>
                                                        <td style={{ textAlign: "center" }}>{item.stockAvailable ? 'Available' : 'Not Available'}</td>
                                                        <td className="product-column">
                                                            <div className="add-to-cart">
                                                                <button id={item.productId} className="add-to-cart-btn" onClick={this.handleClick}>Thêm Giỏ Hàng</button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="delete-wishlist-icon">
                                                                <i id={item.id} onClick={this.handleDelete} className="fa fa-trash" aria-hidden="true"></i>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) :
                                                <tr>
                                                    <td colSpan="6" className='py-5'><h3>Danh sách yêu thích của bạn đang trống</h3></td>
                                                </tr>
                                        :
                                        <tr>
                                            <td colSpan="6" className='py-5'><h3>Vui lòng đăng nhập để xem danh sách yêu thích</h3></td>
                                        </tr>
                                    }
                                </tbody>
                            </table>

                            {this.state.wishlist.length > 0 && this.state.total > this.state.perPage &&
                                <div className="pagination-container">
                                    <Pagination
                                        activePage={this.state.currentPage}
                                        itemsCountPerPage={this.state.perPage}
                                        totalItemsCount={this.state.total}
                                        pageRangeDisplayed={5}
                                        onChange={(pageNumber) => this.getWishlist(pageNumber)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        firstPageText="First"
                                        lastPageText="Last"
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const initialState = {
    user_data: null
};

const mapStateToProps = (state = initialState) => {
    return {
        user: state.user_data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showLogin: () => dispatch({ type: 'LOGIN_CONTROL', value: true }),
        showQuickView: (id) => dispatch({ type: 'QUICKVIEW_CONTROL', value: id }),
        updateWishlistCount: (count) => dispatch({ type: 'WISHLIST_COUNT', value: count })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist)
