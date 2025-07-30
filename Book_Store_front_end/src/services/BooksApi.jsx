import React from 'react'
import axios from 'axios'

//Base Url

const API = axios.create({
    baseURL:"http://127.0.0.1:8000/",
    headers:{
        "Content-Type":"application/json",
    },
});


export const fetchBooks = async ({published, author, category, page, pageSize}) =>{
    console.log("[Fetching books from service - Api]")
    console.log("Params:", {published, author, category, page, pageSize})

    const params = {}
    if(published) params.publish_category=published;
    if(author) params.author=author;
    if(category) params.category=category;
    if(page) params.page=page;
    if(pageSize) params.page_size=pageSize;
    try {
        const res = await API.get("books/", {params})
        console.log(res.data)
        return res.data
    }catch (error) {
        console.error("Error fetching Books", error)
        throw error;
    }
}


export const fetchBook = async(book_id) => {
    console.log("Fetching current one book")
    
    try{
        const res = await API.get(`books/${book_id}`)
        console.log(res.data)
        return res.data
    }catch(error){
        console.error("Failed to fetch current book",error);
        throw error
    }
}


export const deleteBook = async(book_id)=>{
    console.log("[Deletion process]");

    try{
        const res = await API.delete(`books/${book_id}`)
        console.log(res.data)
        return res.data
    }catch(error){
        console.error("Failed to delete",error)
        throw error
    }
}


export const updateBook = async(book_id,updatedBook)=>{
    console.log("[Updating Book]")
    try{
        const res = await API.put(`books/${book_id}`,updatedBook)
        console.log(res.data)
        return res.data
    }catch(error){
        console.log("Failed to update",error)
        throw error
    }
}


export const createBook = async(bookData)=>{
    console.log("[Creating Book]");
    try{
        const res = await API.post("books/",bookData)
        console.log(res.data);
        return res.data
    }catch(error){
        console.log("[Failed to create Book]",error);
        throw error;
    }
}
