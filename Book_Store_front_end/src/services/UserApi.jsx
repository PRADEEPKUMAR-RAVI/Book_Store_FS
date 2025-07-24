import React from 'react'
import axios from 'axios'
import axiosInstance from './axiousInstance';

const API = axios.create({
    baseURL:"http://127.0.0.1:8000/",
    headers:{
        "Content-Type":"application/json",
    },
});


export const fetchUsers = async()=>{
    console.log("[Fetching - User");
    try{
        const res = await API.get('users/');
        console.log(res.data);
        return res.data
    }catch(error){
        console.error("Failer to fetch Users");
        throw error;
    }
}

export const fetchUser = async(UserId)=>{
    console.log("[Fetching - User");
    try{
        const res = await axiosInstance.get(`users/${UserId}`);
        console.log(res.data);
        return res.data
    }catch(error){
        console.error("Failer to fetch Users");
        throw error;
    }
}

export const updateUser = async(UserId,updatedData)=>{
    console.log("[Updating User]");
    try{
        const res = await axiosInstance.patch(`users/${UserId}`,updatedData);
        return res.data
    }catch(error){
        throw error;
    }
}

export const createUser = async(userData)=>{
    try{
        const res = await API.post('users/',userData);
        console.log("User Created", res.data);
        return res.data;
    }catch(error){
        throw error;
    }
}

