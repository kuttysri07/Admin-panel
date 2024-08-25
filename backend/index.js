const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");


const path = require("path");
const Dburl= process.env.DB_URL;

const productModel = require("./Model/productModel");

app.use(cors());
app.use(express.json());


// connect DB
mongoose.connect(`${Dburl}/image`)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));


// send data for db
app.post("/upload", async (req,res)=>{

    try {
        const { name, price, description ,ratings,image} = req.body;

        const item = new productModel({name, price, description ,ratings, image});

        const savedItem = await item.save();

        res.status(200).json({ message: 'Item saved successfully!', item: savedItem });
        
      
    } catch (error) {
        res.status(500).json({ message: 'Error saving item', error });
    }
    
});

app.get("/getImage", async (req, res) => {
    try {
      const items = await productModel.find();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching images', error });
    }
  });


 

app.put("/updateImage/:id",async (req,res)=>{
    const {id} = req.params;
    const {name, price, description,ratings}=req.body;
    try {
      const updateImage = await productModel.findByIdAndUpdate(
        id,
        {name,price,description , ratings},
        {new: true}
      )
      res.json(updateImage);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
  
})


// delete text form db

app.delete("/deleteImage/:id",async (req,res)=>{
    const {id} = req.params;
    const {name, price, description,ratings,image}=req.body;
    try {
      const DeleteImage = await productModel.findByIdAndDelete(id)
      res.json({message:"item was deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
  
})

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});


const Port = process.env.PORT || 8000;;
app.listen(Port ,()=>{
    console.log(`server is running on port ${Port}`)
    
});
