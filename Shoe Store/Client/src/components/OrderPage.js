import React, { useState } from "react";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import "../cssFiles/OrderPage.css";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // get cart items from cart component (in cart compenent we have"navigate("/order", { state: { cartItems: cartItems } });")
  let cartItems = location.state.cartItems;
  // Initialize for data , 3 day shipping is default
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    shippingAddress: "",
    shipmentOption: "3-day",
  });
//success and error messages to be displayed if depending
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  // Fhandle form changes
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    // spread the form data and update the property that was changed
    const newFormData = {
      ...formData,
      [name]: value,
    };

    // update form
    setFormData(newFormData);
  };

  // handle form submission
  const handleSubmit = (e) => {
    //standard in form submission
    e.preventDefault();

    // calculate order sum
    let totalCost = 0;
    for (let i = 0; i < cartItems.length; i++) {
      totalCost += cartItems[i].totalCost;
    }

    // post request to the server
    fetch("http://localhost:3001/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //persnal info
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        shippingAddress: formData.shippingAddress,
        shipmentOption: formData.shipmentOption,
        //all products 
        items: cartItems.map((item) => ({
          product: {
            id: item.product._id, 
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
          },
          //order info
          quantity: item.quantity,
          totalCost: item.totalCost,
        })),
        totalCost: totalCost, 
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        //if successful submissin display success message with order number or error message 
        if (result.order) {
          setOrderNumber(result.order._id);
          setError("");
          setSuccess(result.message);
          //reset form
          setFormData({
            name: "",
            email: "",
            phoneNumber: "",
            shippingAddress: "",
            shipmentOption: "3-day",
          });
          // go back to homepage after some delay and reset local storage
          window.localStorage.setItem("cartItems", []);
          setTimeout(() => {
            navigate("/");
          }, 4000);
        }
      })
      .catch((error) => {
        setError("Error! try again" + error);
      });
  };
  // Calculate sum of order
  let totalOrderCost = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalOrderCost += cartItems[i].totalCost;
  }
  return (
    <>
      <Navbar toggleCart={false} cartItems={cartItems} />
      <div className="orderPage">
        <h1 style={{"text-align": "center"}}>Order Page</h1>
        {/*display products*/}
        {cartItems.map((item) => (
          <div key={item.product._id} className="orderItem">
            <div className="orderItemCard">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="orderItemImage"
              />
              <div className="orderItemDetails">
                <h3>{item.product.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Total Cost: ${item.totalCost}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="orderForm">
          <h2>Submit Order</h2>
          {/*display messgae depending on success/fail of post request*/}
          {error && <p className="errorMessage">{error}</p>}
          {success && <p className="successMessage">{success}</p>}
          {orderNumber && (
            <p className="orderNumber">Your order number is: {orderNumber}</p>
          )}
          {/*all fields are requiered to ensure no empty fields*/}
          <form onSubmit={handleSubmit} className="orderForm">
            Name:
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            Email:
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            Phone Number:
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            Shipping Address:
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              required
            ></textarea>
            Shipment Option:
            <select
              name="shipmentOption"
              value={formData.shipmentOption}
              onChange={handleInputChange}
              required
            >
              <option value="3-day">3-day Shipment (Free)</option>
              <option value="14-day">14-day Shipment (Fee)</option>
            </select>
            Total Cost:
            <p>${totalOrderCost}</p>
            <button type="submit">Submit Order</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
