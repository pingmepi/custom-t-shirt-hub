
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-brand-green">CustomTee</h3>
            <p className="text-gray-600">
              Create your perfect custom t-shirt design with our easy-to-use platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-green">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-green">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-green">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Products</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/designs" className="text-gray-600 hover:text-brand-green">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/designs" className="text-gray-600 hover:text-brand-green">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-green">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-green">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-brand-green">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-brand-green">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-green">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-brand-green">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-brand-green">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} CustomTee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
