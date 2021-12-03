import axios from "axios";

export const axiosReq = axios.create({
    baseURL: 'http://microservice:3001'
})