import React from 'react'
import axios from 'axios'

//Base Url

const API = axios.create({
    baseURL:"http://127.0.0.1:8000/",
    headers:{
        "Content-Type":"application/json",
    },
});



export const fetchAuthors =async()=>{
    console.log("[Fetching - Authors]")
    try{
        const res = await API.get('authors/')
        console.log(res.data)
        return res.data
    }catch(error){
        console.error("Failed to fetch Authors")
        throw error
    }
}

export const fetchAuthor =async(AuthorId)=>{
    console.log("[Fetching - Category]")
    try{
        const res = await API.get(`authors/${AuthorId}`)
        console.log(res.data)
        return res.data
    }catch(error){
        console.error("Failed to fetch Authors")
        throw error
    }
}

export const deleteAuthor = async(AuthorId)=>{
    console.log("[Deleting Author]")
    try{
        const res = await API.delete(`authors/${AuthorId}`)
        console.log(res.msg)
    }catch(error){
        console.log("[Failed to Delete Author]");
        throw error;
    }
}

export const updateAuthor = async(AuthorId,updatedData)=>{
    console.log("[updating Author]");
    try{
        const res = await API.put(`authors/${AuthorId}`,updatedData)
        console.log("raw thing ----------",res);
        return res.data
    }catch(error){
        throw error;
    }
}

export const createAuthor = async(authorData)=>{
    console.log("[Creating Author]");
    try{
        const res = await API.post('authors/',authorData);
        console.log("Author Created", res.data);
        return res.data;
    }catch(error){
        throw error;
    }
}