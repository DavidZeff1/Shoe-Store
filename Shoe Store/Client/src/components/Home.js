import React, { useState, useEffect } from "react";
import Card from "./Card";
import Navbar from "./Navbar";
import "../cssFiles/Home.css";
import logo from "../images/logo2.jpg";
import CartSummary from "./CartSummary";

const Home = () => {
  //for the cart toggle
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  //for the products that will be fetched from db
  const [products, setProducts] = useState([]);
  // in order to get the cart from local storage we need
  //to first check if there are cart items , if there are then return them if not set the cart to empty
  const getCartItemsFromStorage = () => {
    const Cart = window.localStorage.getItem("cartItems");
    if (Cart) {
      return JSON.parse(Cart);
    } else {
      return [];
    }
  };
  const [cartList, setCartList] = useState(getCartItemsFromStorage);
  
  //save the cart list to local storage whenever it changes
  useEffect(() => {
    window.localStorage.setItem("cartItems", JSON.stringify(cartList));
  }, [cartList]);

  //when the cart icon is clicked set it to true/false
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  //handle item being added to cart
  const addToCart = (newItem) => {
    let itemExists = false;
    let updatedCartList = [];

    // Check if item in cart
    for (let i = 0; i < cartList.length; i++) {
      if (cartList[i].product._id === newItem.product._id) {
        itemExists = true;
        //item exists so update cart already existing item
        updatedCartList.push({
          quantity: cartList[i].quantity++,
          product: cartList[i].product,
          totalCost: cartList[i].totalCost + newItem.product.price,
        });
      } else {
        //add the other items to the new cart aswell
        updatedCartList.push(cartList[i]);
      }
    }

    // If item does not exist add it to  cart
    if (!itemExists) {
      updatedCartList.push({
        quantity: 1,
        product: newItem.product,
        totalCost: newItem.product.price,
      });
    }
    //set the updated cart
    setCartList(updatedCartList);
  };
  //handle the deletion from cart
  const removeFromCart = (productId) => {
    const updatedCartList = [];
    //initialize empty cart that will have the updated cart at the end
    for (let i = 0; i < cartList.length; i++) {
      //all items that dont match the one we are deleting add them to cart
      if (cartList[i].product._id !== productId) {
        updatedCartList.push(cartList[i]);
      }
    }
    //set the updated cart
    setCartList(updatedCartList);
  };
  //option to edit quantity, take the id and quantity as params
  const updateQuantity = (productId, quantity) => {
    const updatedCartList = [];
    // Initialize an empty cart that will have the updated cart at the end

    for (let i = 0; i < cartList.length; i++) {
      if (cartList[i].product._id === productId) {
        // If the product matches, update its quantity and totalCost
        const newQuantity = Math.max(1, quantity);
        updatedCartList.push({
          product: cartList[i].product,
          quantity: newQuantity,
          totalCost: newQuantity * cartList[i].product.price,
        });
      } else {
        // If the product does not match add it normal
        updatedCartList.push(cartList[i]);
      }
    }

    // Set the updated cart
    setCartList(updatedCartList);
  };

  // Fetch products
  useEffect(() => {
    //api get address on server
    fetch("http://localhost:3001/products")
      .then((response) => {
        if (!response.ok) {
          alert("error" + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        //if no error then set products with the data returned from server
        setProducts(data);
      })
      .catch((error) => {
        alert("Error! " + error.message);
      });
  }, []);

  return (
    <>
    {/*nav bar component that takes the togglecart function for the cart being pressed within the component*/}
      <Navbar toggleCart={toggleCart} cartItems={cartList} />
      <div className="homeContainer">
        {/*logo img from thats imported from a file within the project */}
        <img
          src={logo}
          alt="Logo"
          className="homeLogo"
          style={{ borderRadius: "50px" }}
        />
        {/*slogan and description*/}
        <h1 className="homeSlogan">Walking for feets sake!</h1>
        <p className="homeDescription">
          At Foot Walker we pride ourselves in producing the best foot wear
          known to man! we gaurantee user satisfaction for all your feet needs
          and will go to any length to ensure that our customers are satisfied!
        </p>
        <div className="productsContainer">
          {/*set all the cards to have the product info from the server*/}
          {products.map((product) => (
            <Card
              key={product._id}
              product={{
                _id: product._id,
                name: product.name,
                price: product.price,
                image: `images/${product.image}`,
                description: product.description
              }}
              //every card will take the function that will enable the add to cart functionality within the card
              addToCart={addToCart}
            />
          ))}
        </div>
        {/*in jsx standard conditionals using && (its like if(isCartOpen){}we cant use regular conditionals like we would use them normally)*/}
        {isCartOpen && (
          <CartSummary
          //take the cartitems list and the cart toggle functionality ,remove from cart functionality, and update quantity,
          //some of these will be triggered at the cartSumm component but handled here at home component
            cartItems={cartList}
            closeCart={() => setIsCartOpen(false)}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        )}
      </div>
    </>
  );
};

export default Home;
