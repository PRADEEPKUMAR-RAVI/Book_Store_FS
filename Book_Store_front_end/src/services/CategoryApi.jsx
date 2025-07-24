import React from 'react'
import axios from 'axios'

//Base Url

const API = axios.create({
    baseURL:"http://127.0.0.1:8000/",
    headers:{
        "Content-Type":"application/json",
    },
});



export const fetchCategories =async()=>{
    console.log("[Fetching - Categories]")
    try{
        const res = await API.get('category/')
        console.log(res.data)
        return res.data
    }catch(error){
        console.error("Failed to fetch Authors")
        throw error
    }
}

export const fetchCategory =async(CatId)=>{
    console.log("[Fetching - Category]")
    try{
        const res = await API.get(`category/${CatId}`)
        console.log(res.data)
        return res.data
    }catch(error){
        console.error("Failed to fetch Authors")
        throw error
    }
}


export const updateCategory = async(CatId, updatedData)=>{
    console.log("[Updating - Category]")
    try{
        const res = await API.put(`category/${CatId}`, updatedData)
        return res.data
    }catch(error){
        throw error;
    }
}

export const deleteCategory = async(CatId)=>{
    console.log("[Deleting - Category]")
    try{
        const res = await API.delete(`category/${CatId}`)
        return res.data
    }catch(error){
        throw error;
    }
}


export const createCategory = async(categoryData)=>{
    console.log("[Creating - Category]");
    try{
        const res = await API.post('category/', categoryData);
        console.log(res.data);
        return res.data;
    }catch(error){
        throw error;
    }
}