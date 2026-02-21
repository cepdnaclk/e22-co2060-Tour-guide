import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Contact Column */}
        <div className="footer-column contact-column">
          <h4>CONTACT US</h4>
          <ul className="contact-list">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>
                Bambaragammana, Puttalam road,<br />
                Wariyapola, Sri Lanka
              </span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>Tel: +94703384648</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>Mail: chamodharshana31@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025. All rights reserved.</p>
        <p>
          Designed by <a href="/">Perfect Guide</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;