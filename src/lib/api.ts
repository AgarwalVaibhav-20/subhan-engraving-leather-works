import axios from "axios";

export const fetchProductById =async (id:string)=>{
    const res = await axios.get(`/api/product/${id}`);
    return res.data;
}