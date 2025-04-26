import React, { Component } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { Api } from "../../api/Api";
import { Link } from "react-router-dom";

class ListProduct extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      currentPage: 1,
      perPage: 10, // Giá trị mặc định an toàn
      total: 0,
      products: [],
      deletingProductId: null,
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = (pageNumber = 1) => {
    this.setState({ loading: true });
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    Axios.get(`${Api}/product`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
      },
    })
      .then((res) => {
        console.log(res.data); // In ra dữ liệu từ API
        const allProducts = res.data;
        const { perPage } = this.state;
        const total = allProducts.length;

        // Tính vị trí bắt đầu và kết thúc
        const start = (pageNumber - 1) * perPage;
        const end = start + perPage;

        const paginatedProducts = allProducts.slice(start, end);

        this.setState({
          products: paginatedProducts,
          total,
          currentPage: pageNumber,
          loading: false,
        });
      })
      .catch((err) => {
        console.error("Lỗi tải sản phẩm:", err);
        this.setState({ loading: false });
      });
  };

  handleDelete = (productId) => {
    this.setState({ deletingProductId: productId });

    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn sẽ không thể khôi phục dữ liệu sau khi xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        Axios.delete(`${Api}/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
          .then((res) => {
            Swal.fire("Đã xóa!", res.data.message, "success");
            this.getProducts(this.state.currentPage);
          })
          .catch((err) => {
            Swal.fire(
              "Lỗi!",
              err.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm.",
              "error"
            );
          })
          .finally(() => {
            this.setState({ deletingProductId: null });
          });
      } else {
        this.setState({ deletingProductId: null });
      }
    });
  };

  render() {
    const { loading, products, currentPage, perPage, total, deletingProductId } = this.state;

    return (
      <div className="container mt-4">
        <h3 className="mb-4 text-danger">Danh sách sản phẩm</h3>
        <Link to={`/admin/product/create`}>
          <Button variant="danger" size="sm" className="me-2">
            <h5 className="mb-1 text-white">Thêm sản phẩm</h5>
          </Button>
        </Link>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-danger">#</th>
                  <th className="text-danger">ID</th>
                  <th className="text-danger">Id danh mục</th>
                  <th className="text-danger">Tên sản phẩm</th>
                  <th className="text-danger"> Id thương hiệu</th>
                  <th className="text-danger">Giá</th>
                  <th className="text-danger">Ngày tạo</th>
                  <th className="text-danger">Ngày cập nhật</th>
                  <th className="text-danger">Ảnh</th>
                  <th className="text-danger">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(products) || products.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.productId || index}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td>{product.productId}</td>
                      <td>{product.categoryId}</td>
                      <td>{product.productName}</td>
                      <td>{product.brandId }</td>
                      <td>{product.price} VND</td>
                      <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td>{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "Chưa cập nhật"}</td>
                      <td>
                        {product.image ? (
                          <img
                          src={`/img/${product.image}`}
                          alt={product.productName}
                            width={60}
                            height={60}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                          />
                        ) : (
                          "Không có ảnh"
                        )}
                      </td>
                      <td>
                        <Link to={`/admin/products/edit/${product.productId}`}>
                          <Button variant="warning" size="sm" className="me-2">
                            Sửa
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => this.handleDelete(product.productId)}
                          disabled={deletingProductId === product.productId}
                        >
                          {deletingProductId === product.productId ? "Đang xóa..." : "Xóa"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-4">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={perPage}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(page) => this.getProducts(page)}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ListProduct;
