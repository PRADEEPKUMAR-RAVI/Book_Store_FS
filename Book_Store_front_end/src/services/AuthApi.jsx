import axios from "axios";

const API = axios.create({
    baseURL:"http://127.0.0.1:8000/",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json",
    },
});


export const userLogin=async(form)=>{
    console.log("[Login - Process]")
    try{
        const res = await API.post('auth/login',form, {withCredentials:true});
        console.log(res.data);
        return res.data;
    }catch(error){
        throw error;
    }
}

export const userRegister=async(form)=>{
    console.log("[Register - Process]")
    try{
        const res = await API.post('auth/register',form, {withCredentials:true});
        console.log(res.data);
        return res.data;
    }catch(error){
        alert(error.response.data.detail)
        throw error;
    }
}