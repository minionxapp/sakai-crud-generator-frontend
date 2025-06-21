import axios from "axios";

const custumFetch = axios.create({
    baseURL :'http://localhost:3000/api'

})

export default custumFetch