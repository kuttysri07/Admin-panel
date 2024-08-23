const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const multer =require("multer");

const path = require("path");
const Dburl= process.env.DB_URL;

const productModel = require("./Model/productModel");

app.use(cors());
app.use(express.json());
app.use(express.static('public/images'))


// connect DB
mongoose.connect(`${Dburl}/image`)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));

// for image upload

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'public/images')
    },
    filename :(req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage
})


// send data for db
app.post("/upload",upload.single('file'), async (req,res)=>{

    try {
        const { name, price, description ,ratings} = req.body;

        const item = new productModel({name, price, description ,ratings, image:req.file.filename});

        const savedItem = await item.save();

        res.status(200).json({ message: 'Item saved successfully!', item: savedItem });
        
      
    } catch (error) {
        res.status(500).json({ message: 'Error saving item', error });
    }
    
});


app.get("/getImage", (req, res) => {
    productModel.find()
    .then(result => res.json(result))  // Send the result back to the frontend
    .catch(err => res.status(500).json({ error: err.message }));

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

// delete image in public folder 

const fs = require('fs');


app.delete("/deleteImage/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await productModel.findByIdAndDelete(id);
        if (deletedItem) {
            const filePath = path.join(__dirname, 'public/images', deletedItem.image);
            fs.unlink(filePath, (err) => {
                if (err) console.log(`Error deleting file: ${err}`);
            });
            res.json({ message: "Item deleted successfully" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// delete text form db

app.delete("/deleteImage/:id",async (req,res)=>{
    const {id} = req.params;
    const {name, price, description,ratings}=req.body;
    try {
      const DeleteImage = await productModel.findByIdAndDelete(
        id,
        {name,price,description,ratings},
        {new: true}
      )
      res.json({message:"item was deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
  
})

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
// });


const Port = process.env.PORT || 8000;;
app.listen(Port ,()=>{
    console.log(`server is running on port ${Port}`)
    
});
