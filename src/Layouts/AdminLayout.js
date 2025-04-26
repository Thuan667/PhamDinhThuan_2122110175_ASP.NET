import React from 'react';
import Admin from '../pages/admin/Dashboard';
import ListProduct from '../pages/admin/product/ListProduct';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../pages/admin/product/Header';
import ListCategory from '../pages/admin/category/ListCategory';
import CreateProduct from '../pages/admin/product/CreateProduct';
import EditProduct from '../pages/admin/product/EditProduct';
import User from '../pages/admin/user/User';
import ListOrder from '../pages/admin/order/ListOrder';

function PrivateRoute({ element, allowedRoles, ...rest }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/" />;  
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;  
    }

    return element;
}

function AdminLayout() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<PrivateRoute element={<Admin />} allowedRoles={["admin"]} />} />
                <Route path="/product" element={<PrivateRoute element={<ListProduct />} allowedRoles={["admin"]} />} />
                <Route path="/category" element={<PrivateRoute element={<ListCategory />} allowedRoles={["admin"]} />} />
                <Route path="/product/create" element={<PrivateRoute element={<CreateProduct />} allowedRoles={["admin"]} />} />
                <Route path="/products/edit/:id" element={<PrivateRoute element={<EditProduct />} allowedRoles={["admin"]} />} />
                <Route path="/orders" element={<PrivateRoute element={<ListOrder />} allowedRoles={["admin"]} />} />
                <Route path="/users" element={<PrivateRoute element={<User />} allowedRoles={["admin"]} />} />
            </Routes>
        </div>
    );
}

export default AdminLayout;
