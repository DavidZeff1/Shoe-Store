
import React from "react";
import "../cssFiles/Card.css"; 
//every card will have product as prop that will have all product info and also add addtocart function 
const Card = ({ product, addToCart }) => {
  
  //when add cart button is pressed it will trigger addtocart function that is handles in home component
  const handleAddToCart = () => {
    addToCart({
      product: product,
      quantity: 1,
      totalCost: product.price,
    });
  };
//basic layout, all details will be pulled out of the product prop which holds img, name etc...
  return (
    <div className="cardContainer">
      <img src={product.image} alt={product.name} className="cardImg" />
      <div className="cardBody">
        <h2 className="cardHeading">{product.name}</h2>
        <p className="cardText">{product.description}</p>
        <p className="cardCost">${product.price}</p>
        <button className="addBtn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};


export default Card;
