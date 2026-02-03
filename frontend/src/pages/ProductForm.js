import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProductForm.css';

// ADDED: API URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    price: '',
    quantity: '',
    sku: '',
    supplier: '',
    reorderLevel: '10'
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEdit);

  /**
   * ✅ Wrapped in useCallback
   */
  const fetchProduct = useCallback(async () => {
    try {
      // CHANGED: Added API_URL and token
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
          sku: product.sku,
          supplier: product.supplier || '',
          reorderLevel: product.reorderLevel.toString()
        });
      }

      setFetchingProduct(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    }
  }, [id, navigate]);

  /**
   * ✅ Proper dependency array
   */
  useEffect(() => {
    if (isEdit && id) {
      fetchProduct();
    }
  }, [isEdit, id, fetchProduct]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      reorderLevel: parseInt(formData.reorderLevel)
    };

    try {
      // CHANGED: Added API_URL and token to both requests
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      let response;

      if (isEdit) {
        response = await axios.put(`${API_URL}/api/products/${id}`, productData, config);
      } else {
        response = await axios.post(`${API_URL}/api/products`, productData, config);
      }

      if (response.data.success) {
        toast.success(
          `Product ${isEdit ? 'updated' : 'created'} successfully`
        );
        navigate('/products');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEdit ? 'update' : 'create'} product`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="container text-center" style={{ paddingTop: '50px' }}>
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <div className="container">
        <div className="form-card">
          <h1 className="form-title">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU *</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className="form-control"
                  placeholder="e.g., PROD-001"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                />
                {isEdit && (
                  <small className="form-text">
                    SKU cannot be changed
                  </small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Enter product description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Toys">Toys</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  className="form-control"
                  placeholder="Enter supplier name"
                  value={formData.supplier}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="form-control"
                  placeholder="0"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reorderLevel">Reorder Level *</label>
                <input
                  type="number"
                  id="reorderLevel"
                  name="reorderLevel"
                  className="form-control"
                  placeholder="10"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                  ? 'Update Product'
                  : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;