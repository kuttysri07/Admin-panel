import { useState, useEffect } from "react";
import "./main.css";
import axios from "axios";
import EditImage from "./Editimage";
import app from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const API_URL = process.env.REACT_APP_API_URL;

const Main = () => {

  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState([]); // Ensure items is initialized as an array


  const [createProduct, setCreateProduct] = useState({
    name: '',
    price: '',
    description: '',
    ratings: '',
    image: '', // Ensure image is part of the initial state
  });


 

  const handleChange = (e) => {
    setCreateProduct({
      ...createProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeImg = async (e) => {
    const image = e.target.files[0];
    if (image) {
      try {
        setUploading(true);
        
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + image.name);
        await uploadBytes(storageRef, image);
        const downloadUrl = await getDownloadURL(storageRef);
        setCreateProduct((prevState) => ({
          ...prevState,
          image: downloadUrl // Set the image URL in the state
        }));
      } catch (error) {
        console.log(error.message);
        
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadHandler = async () => {
    try {
      const response = await axios.post(`${API_URL}/upload`, createProduct);
      fetchImages(); // Fetch the updated list of images after a new upload
      console.log("Product data sent to server:", response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchImages = () => {
    axios.get(`${API_URL}/getImage`)
      .then(res => {
        console.log('Fetched data:', res.data); // Log the fetched data
          setItems(res.data);
      })
      .catch(error => {
        console.log(error.message);
      })
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${API_URL}/deleteImage/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.log(err.message);
      
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <div className="Mainbox">
        <div className='box'>
          <center><h1>ADMIN PANEL</h1></center>
         
          <input type="file" onChange={handleChangeImg} />
          <label htmlFor="dishname">Dish Name :</label>
          <input type="text" placeholder="Enter Dish Name" onChange={handleChange} name="name" />
          <label htmlFor="description">Description :</label>
          <input type="text" placeholder="Enter Description" onChange={handleChange} name="description" />
          <label htmlFor="price">Price :</label>
          <input type="number" placeholder=" Enter Price" onChange={handleChange} name="price" />
          <label htmlFor="ratings">Ratings :</label>
          <input type="number" placeholder="Enter Ratings" onChange={handleChange} name="ratings" />
          <button disabled={uploading} className="submit" onClick={uploadHandler}>
            {uploading ? "Uploading Please Wait" : "UPLOAD"}
          </button>
        </div>
      </div>

      <div className="productDisply">
        { items.map((item) => (
            <div className='cardcontainer' key={item._id}>
              <img className="bbqimg" src={item.image} alt={item.name} />
              <div className="details">
                <h1>{item.name}</h1>
                <p>{item.description}</p>
                <h2>${item.price}</h2>
                <div className="ratings mt-auto">
                  <div className="rating-outer">
                    <div className="rating-inner" style={{ width: `${(item.ratings / 5) * 100}%` }}></div>
                  </div>
                </div>
                <div className="buttongrp">
                  <EditImage item={item} />
                  <button onClick={() => deleteHandler(item._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Main;
