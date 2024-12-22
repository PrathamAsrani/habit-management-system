import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h2>Habit Management System</h2>
          <p>Organize your habits, improve productivity, and achieve your goals.</p>
        </div>
        <div className="footer-right">
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Habit Management System. Designed by Pratham Asrani.</p>
      </div>
    </footer>
  );
};

export default Footer;
