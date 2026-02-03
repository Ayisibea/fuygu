import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBox, FaChartLine, FaShieldAlt, FaRocket } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Manage Your Inventory with Ease</h1>
            <p className="hero-subtitle">
              A powerful, intuitive inventory management system built with the MERN stack.
              Track products, manage stock levels, and streamline your business operations.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaBox />
              </div>
              <h3>Product Management</h3>
              <p>Add, edit, and delete products with comprehensive details including SKU, pricing, and descriptions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Stock Tracking</h3>
              <p>Real-time inventory tracking with low stock alerts and automatic status updates.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure Authentication</h3>
              <p>JWT-based authentication system ensuring your data is protected and secure.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h3>Fast & Responsive</h3>
              <p>Built with modern technologies for a smooth, fast user experience on any device.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tech-section">
        <div className="container">
          <h2 className="section-title">Built with Modern Technology</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <h4>MongoDB</h4>
              <p>NoSQL Database</p>
            </div>
            <div className="tech-item">
              <h4>Express.js</h4>
              <p>Backend Framework</p>
            </div>
            <div className="tech-item">
              <h4>React.js</h4>
              <p>Frontend Library</p>
            </div>
            <div className="tech-item">
              <h4>Node.js</h4>
              <p>Runtime Environment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
