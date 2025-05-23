import React from 'react';
// internal
import logo from '../assets/img/logo-footer.webp';
import pay from '../assets/img/footer-pay.png';
import social_data from '../data/social-data';
import { Email, Location } from '../svg';

const Footer = ({ style_2 = false, style_3 = false, primary_style = false }) => {
  return (
    <footer>
      <div className={`tp-footer-area ${primary_style ? 'tp-footer-style-2 tp-footer-style-primary tp-footer-style-6' : ''} ${style_2 ? 'tp-footer-style-2' : style_3 ? 'tp-footer-style-2 tp-footer-style-3' : ''}`}
        style={{ backgroundColor: 'transparent', border: 'none' }}>
        <div className="tp-footer-top pt-95 pb-40">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-1 mb-50">
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-logo">
                      <a href="/">
                        <img src={logo} alt="logo" />
                      </a>
                    </div>
                    <p className="tp-footer-desc">Chúng tôi là một đội ngũ phát triển full stack và thiết kế năng động, chuyên tạo ra các ứng dụng web chất lượng cao</p>
                    <div className="tp-footer-social">
                      {social_data.map(s => (
                        <a href={s.link} key={s.id} target="_blank" rel="noopener noreferrer">
                          <i className={s.icon}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-2 mb-50">
                  <h4 className="tp-footer-widget-title">My Account</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><a href="#" style={{ color: 'black' }}>Track Orders</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Shipping</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Wishlist</a></li>
                      <li><a href="#" style={{ color: 'black' }}>My Account</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Order History</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Returns</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-3 mb-50">
                  <h4 className="tp-footer-widget-title">Information</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><a href="#" style={{ color: 'black' }}>Our Story</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Careers</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Privacy Policy</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Terms & Conditions</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Latest News</a></li>
                      <li><a href="#" style={{ color: 'black' }}>Contact Us</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-4 mb-50">
                  <h4 className="tp-footer-widget-title">Talk To Us</h4>
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-talk mb-20">
                      <span style={{ color: 'black' }}>Got Questions? Call us</span>
                      <h4><a href="tel:670-413-90-762" style={{ color: 'black' }}>+966 595 035 008</a></h4>
                    </div>
                    <div className="tp-footer-contact">
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Email />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><a href="mailto:shofy@support.com" style={{ color: 'black' }}>swe.hamedhasan@gmail.com</a></p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Location />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p>
                            <a href="https://www.google.com/maps/place/Sleepy+Hollow+Rd,+Gouverneur,+NY+13642,+USA/@44.3304966,-75.4552367,17z/data=!3m1!4b1!4m6!3m5!1s0x4cccddac8972c5eb:0x56286024afff537a!8m2!3d44.3304928!4d-75.453048!16s%2Fg%2F1tdsjdj4" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>
                              79 Sleepy Hollow St. <br /> Jamaica, Jeddah 1432
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tp-footer-bottom">
          <div className="container">
            <div className="tp-footer-bottom-wrapper">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-footer-copyright">
                    <p>© {new Date().getFullYear()} All Rights Reserved | Template by
                      <a href="/"> ❤</a>.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-footer-payment text-md-end">
                    <p>
                      <img src={pay} alt="pay" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
