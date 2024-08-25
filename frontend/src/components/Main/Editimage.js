import { useState } from "react";
import axios from "axios";
import "./editimage.css"

const API_URL = process.env.REACT_APP_API_URL;
const EditImage = ({ item }) => {

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);
  const [ratings,setRatings]=useState(item.ratings)
  const updateDescription = async () => {
   
    try {
      const response = await axios.put(`${API_URL}/updateImage/${item._id}`, {
        name,
        price,
        description,
        ratings
      });
      console.log('Updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating product:', error);
    }
    window.location="/";
   
  };

  return (
    <div>
      <button  data-bs-toggle="modal" data-bs-target={`#id${item._id}`}>
        Edit
      </button>

      <div className="modal fade" id={`id${item._id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Product</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>{
                setName(item.name);
                setPrice(item.price);
                setDescription(item.description);
                setRatings(item.ratings);
              }}></button>
            </div>
            <div className="modal-body">
                <label htmlFor="Name">Name:</label><br />
                <input className="form-control mb-2" value={name} onChange={e => setName(e.target.value)} type="text" />
                <label htmlFor="Description">Description:</label><br />
                <input className="form-control mb-2" value={description} onChange={e => setDescription(e.target.value)} type="text" />
                <label htmlFor="Price">Price:</label><br />
                <input className="form-control mb-2" value={price} onChange={e => setPrice(e.target.value)} type="number" />
                <label htmlFor="ratings">ratings</label><br />
                <input className="form-control mb-2" value={ratings} onChange={e => setRatings(e.target.value)} type="number" />     
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {
                setName(item.name);
                setPrice(item.price);
                setDescription(item.description);
                setRatings(item.ratings);
              }}>Close</button>
              <button type="button" onClick={updateDescription}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditImage;
