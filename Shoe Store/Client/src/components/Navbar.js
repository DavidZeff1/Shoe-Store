import React from "react";
import { FaShoppingCart, FaHome } from "react-icons/fa";
import "../cssFiles/navbar.css";

const Navbar = ({ toggleCart, cartItems }) => {
  return (
    <nav className="navBar">
      <div className="navBarLogo">Foot Walker</div>
      <div className="navBarIcons">
         {/*using react icons, home icon has ref to home page*/}
        <a href="/home">
          <FaHome size={20} />
        </a>
        {/*cart icon will trigger the cart toggle which is handled at home*/}
        <button className="cartIcon" onClick={toggleCart}>
          <FaShoppingCart size={20} />
          {/*if there are items then display the amount in cart*/}
          {cartItems.length > 0 && (
            <span className="cartBadge">{cartItems.length}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

