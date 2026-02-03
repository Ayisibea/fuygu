import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBox, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, lowStockRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/products/low-stock')
      ]);

      if (productsRes.data.success) {
        const products = productsRes.data.data;
        setStats({
          totalProducts: products.length,
          inStock: products.filter(p => p.status === 'In Stock').length,
          lowStock: products.filter(p => p.status === 'Low Stock').length,
          outOfStock: products.filter(p => p.status === 'Out of Stock').length
        });
      }

      if (lowStockRes.data.success) {
        setLowStockProducts(lowStockRes.data.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '50px' }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <h1 className="dashboard-title">Dashboard Overview</h1>

        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{stats.inStock}</h3>
              <p>In Stock</p>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{stats.lowStock}</h3>
              <p>Low Stock</p>
            </div>
          </div>

          <div className="stat-card stat-danger">
            <div className="stat-icon">
              <FaTimesCircle />
            </div>
            <div className="stat-content">
              <h3>{stats.outOfStock}</h3>
              <p>Out of Stock</p>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header flex-between">
            <h2>Low Stock Alert</h2>
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center" style={{ padding: '30px' }}>
              <p style={{ color: '#28a745', fontSize: '18px' }}>
                ✓ All products are well stocked!
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <span className={`badge badge-${product.status === 'Low Stock' ? 'warning' : 'danger'}`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
