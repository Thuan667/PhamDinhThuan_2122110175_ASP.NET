import React, { useState } from 'react';
import axios from 'axios';
import { Api } from '../api/Api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendLink = () => {
        if (!email) {
            setError('Vui lòng nhập email!');
            return;
        }

        axios.post(`${Api}/password/email`, { email })
            .then(response => {
                setSuccessMessage('Đường link đặt lại mật khẩu đã được gửi đến email của bạn.');
                setError('');
                setEmail('');
            })
            .catch(err => {
                const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi!';
                setError(errorMessage);
                console.error("Error sending reset link:", err);
            });
    };

    return (
        <div style={styles.container}>
            <a href="/" style={styles.backLink}>
                <span style={styles.arrow}>&larr;</span> Quay về trang chủ
            </a>
            <h2 style={styles.heading}>Nhập Gmail của bạn!</h2>
            {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ ...styles.message, color: 'green' }}>{successMessage}</p>}
            <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleSendLink} style={styles.button}>Gửi đường link đặt lại mật khẩu</button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '16px',
        marginBottom: '20px',
    },
    arrow: {
        marginRight: '8px',
    },
    heading: {
        marginBottom: '20px',
        fontSize: '24px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
    },
    message: {
        fontSize: '14px',
        marginBottom: '15px',
    },
};

export default ForgotPassword;
