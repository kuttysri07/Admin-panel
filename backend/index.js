const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Dburl = process.env.DB_URL;
const productModel = require("./Model/productModel");

app.use(cors());
app.use(express.json());

// Connect to DB
mongoose.connect(`${Dburl}/image`)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Upload data to DB
app.post("/upload", async (req, res) => {
    try {
        const { name, price, description, ratings, image, category } = req.body;
        const item = new productModel({ name, price, description, ratings, image, category });
        const savedItem = await item.save();
        res.status(200).json({ message: 'Item saved successfully!', item: savedItem });
    } catch (error) {
        res.status(500).json({ message: 'Error saving item', error });
    }
});

// Fetch all images
app.get("/getImage", async (req, res) => {
    try {
        const items = await productModel.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching images', error });
    }
});

// Fetch images by category
app.get("/getImage/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const findbyCategory = await productModel.find({ category });
        if (findbyCategory.length > 0) {
            res.status(200).json(findbyCategory);
        } else {
            res.status(404).json({ message: "No products found in this category" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update image details
app.put("/updateImage/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, description, ratings, category } = req.body;
    try {
        const updateImage = await productModel.findByIdAndUpdate(
            id,
            { name, price, description, ratings, category },
            { new: true }
        );
        res.json(updateImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete image
app.delete("/deleteImage/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await productModel.findByIdAndDelete(id);
        res.json({ message: "Item was deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

const Port = process.env.PORT || 8000;
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
