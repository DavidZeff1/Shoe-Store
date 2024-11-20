const express = require("express");
const mongojs = require("mongojs");
const cors = require("cors"); 

const app = express();

//had some issues with server and cors fixed it
app.use(cors()); 
app.use(express.json());
app.use(express.static("static"));

// MongoDB connection, db will hold products collection and final collection to hold the orders
const db = mongojs(
  "mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024",
  ["products", "final_David_Zeff_and_Maha_Elriati"]
);

// return all products from products collection in the db
app.get("/products", (req, res) => {
  db.products.find({}, (err, products) => {
    if (err) {
      res.json({ error: "Erorr!" + err });
    } else {
      //if no error return products
      res.json(products);
    }
  });
});

// post order to server
app.post("/orders", (req, res) => {
  const newOrder = req.body;
  //add new order to the db
  db.final_David_Zeff_and_Maha_Elriati.insert(newOrder, (err, result) => {
    if (err) {
      res.json({ error: "Erorr!" + err });
    } else {
      res.json({
        order: result,
        message: "Order success!",
      });
    }
  });
});


app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
