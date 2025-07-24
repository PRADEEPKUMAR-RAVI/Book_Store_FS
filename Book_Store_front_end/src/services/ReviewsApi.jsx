import axios from "axios";
import axiosInstance from './axiousInstance';

const API = axios.create({
    baseURL:"http://127.0.0.1:8000/",
    headers:{
        "Content-Type":"application/json",
    },
});


export const fetchReviews = async (BookId) =>{
    console.log("[Fetching reviews from service - Api]")
    try {
        const res = await API.get(`books/${BookId}/reviews`)
        console.log(res.data)
        return res.data
    }catch (error) {
        console.error("Error fetching Reviews", error)
        throw error;
    }
}

export const fetchReview = async (BookId,ReviewId) =>{
    console.log("[Fetching review from service - Api]")
    try {
        const res = await API.get(`books/${BookId}/reviews/${ReviewId}`)
        console.log(res.data)
        return res.data
    }catch (error) {
        console.error("Error fetching Review", error)
        throw error;
    }
}

export const createReviews = async (BookId,reviewData) =>{
    console.log("[Fetching review from service - Api]")
    try {
        const res = await axiosInstance.post(`books/${BookId}/reviews`,reviewData)
        console.log(res.data)
        return res.data
    }catch (error) {
        console.error("Error Creating Reviews", error)
        throw error;
    }
}

export const updateReviews = async (BookId,ReviewId,reviewData) =>{
    console.log("[Fetching review from service - Api]")
    try {
        const res = await axiosInstance.put(`books/${BookId}/reviews/${ReviewId}`,reviewData)
        console.log(res.data)
        return res.data
    }catch (error) {
        console.error("Error Updating Reviews", error)
        throw error;
    }
}

export const deleteReview = async(BookId,ReviewId)=>{
    console.log("[Deleting process - review]")
    try{
        const res = await axiosInstance.delete(`books/${BookId}/reviews/${ReviewId}`)
        console.log(res.data)
        return res
    }catch(error){
        console.error("Error deleting",error);
        throw error;
    }
}



