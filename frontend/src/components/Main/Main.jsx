import { useState ,useEffect} from "react";
import "./main.css"
import axios from "axios";
import EditImage from "./Editimage";

const API_URL = process.env.REACT_APP_API_URL;


const Main = () => {

  const [createproduct, setCreateProduct] = useState({
    name: '',
    price: '',
    description: '',
    ratings:''
});

const handleChange = (e) =>{
  
  setCreateProduct({
      ...createproduct,
      [e.target.name]: e.target.value,
  });
}

const [file, setFile] = useState(null);

const [images, setImages] = useState([]);


const uploadHandler = async () => {
        
  const formData = new FormData();
  formData.append("name", createproduct.name);
  formData.append("price", createproduct.price);
  formData.append("description", createproduct.description);
  formData.append("ratings", createproduct.ratings);
  formData.append("file", file);

try {
  const response = await axios.post(`${API_URL}/upload`, formData)
  fetchImages();  // Fetch the updated list of images after a new upload
  window.location.href = "/";
} catch (error) {
  console.log(error.message);
  
}
  
}


    // get all data image and texts
    const fetchImages = () => {
       
      axios.get(`${API_URL}/getImage`)
     
      .then(res => {
          setImages(res.data);
            // Set all images from the response data
      })
      .catch(err => console.log(err));
  }

      //delete one card

      const deleteHandler = async (id) => {
        try {
            await axios.delete(`${API_URL}/deleteImage/${id}`);  // Ensure you're passing the id directly
            setImages(images.filter(img => img._id !== id));  // Use img._id instead of img.id
        } catch (err) {
            console.log({ message: err.message });
        }
    };

    useEffect(() => {
        fetchImages();
        
    }, []);



  return (
    <div >
       <div className="Mainbox">
      <div className='box'>
       <center><h1>ADMIN PANNEL</h1></center> 
            <input type="file" placeholder="Upload Dish Image" onChange={(e) => setFile(e.target.files[0])}  />
            <label htmlFor="dishname">Dish Name :</label>
            <input type="text" placeholder="Enter Dish Name" onChange={handleChange} name="name" />
            <label htmlFor="description">Description :</label>
            <input type="text" placeholder="Enter Description" onChange={handleChange} name="description" />
            <label htmlFor="price">Price :</label>
            <input type="number" placeholder=" Enter Price" onChange={handleChange} name="price" />
            <label htmlFor="ratings">Ratings :</label>
            <input type="number" placeholder="Enter Ratings" onChange={handleChange} name="ratings"  />
            <button className="submit" onClick={uploadHandler}>UPLOAD</button>
        </div>
        </div>

    <div className="productDisply">
        {images.map((img,index)=>(
             <div className='cardcontainer'  key={index}>
               <img className="bbqimg" src={`${API_URL}/${img.image}`} alt={img.name} />
             <div className="details">
                     <h1>{img.name}</h1>
                     <p> {img.description}</p>
                     <h2>${img.price}</h2>
                     <div className="ratings mt-auto">
                     <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(img.ratings / 5) * 100}%` }}></div>
                     </div>

                     </div>

                  
                  <div className="buttongrp">
                     <EditImage  img={img} />
                     <button onClick={()=>deleteHandler(img._id)}>Delete</button>
                     </div>
                  
             </div>
     </div>
        ))}

  </div>
       



    </div>
  )
}

export default Main