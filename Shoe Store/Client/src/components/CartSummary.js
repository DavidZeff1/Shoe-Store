import React from "react";
import { useNavigate } from "react-router-dom";
import "../cssFiles/CartSummary.css"; 

const CartSummary = ({
  //has all the products info
  cartItems,
  //the 3 below will be triggered here but handled at home component
  closeCart,
  removeFromCart,
  updateQuantity,
}) => {
  const navigate = useNavigate();
//when clicked proceed to order we will navigates to order page with all the cart items
  const handleProceedToOrder = () => {
    navigate("/order", { state:{ cartItems: cartItems } 
      });
  };

  //  sum price calculation
  let totalPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalPrice += cartItems[i].totalCost;
  }

  return (
    <div className="cartContainer">
      {/*closcart handled at home compenent */}
      <button className="closeCartButton" onClick={closeCart}>
        Close
      </button>
      <h2 className="header">Shopping Cart</h2>
      {/*if cartitems are empty will display cart empty text else will display all items*/}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.product._id} className="cartItem">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="cartItemImg"
            />
            <div className="cartItemDetails">
              <h3 className="cartItemTitle">{item.product.name}</h3>
              <p className="cartItemText">
                Price per Unit: ${item.product.price}
              </p>
              <p className="cartItemText">
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  //this will be handled at home, send id and quantity as params
                  onChange={(e) =>
                    updateQuantity(item.product._id, e.target.value)
                  }
                  className="quantityInput"
                />
              </p>
              <p className="cartItemText">Total Cost: ${item.totalCost}</p>
              <button
              //this will be handled at home
                onClick={() => removeFromCart(item.product._id)}
                className="removeBtn"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
      
      {cartItems.length > 0 && (//jsx style "if" if there are itmes display total price
        <>
          <div className="totalPrice">
            <h3>Total Price: ${totalPrice}</h3>
          </div>
          {/*will go to order page*/}
          <button onClick={handleProceedToOrder} className="proceedBtn">
            Proceed to Order
          </button>
        </>
      )}
    </div>
  );
};

export default CartSummary;
