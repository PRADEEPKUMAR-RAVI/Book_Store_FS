import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { fetchUser, updateUser } from '../services/UserApi';

export const EditUser = () => {
    const{UserId} = useParams();
    const navigate = useNavigate();
    const[form, setForm] = useState({
        username:"",
        email:"",
        // password:"",
        first_name:"",
        last_name:""
    });

    useEffect(()=>{
        const loadUser=async()=>{
            try{
                const data = await fetchUser(UserId)
                setForm({
                    username:data.username || "",
                    email:data.email || "",
                    // password:data.password || "",
                    first_name:data.first_name || "",
                    last_name:data.last_name || ""
                });
            }catch(error){
                throw error;
            }
        }
        loadUser();
    },[]);

    async function handleSubmit(e){
        e.preventDefault();
        try{
            await updateUser(UserId,form);
            alert("User updated Successfully !!");
            navigate(`/users/${UserId}`)
        }catch(error){
            console.error("Update failed",error);
        }
    }

    function handleChange(e){
        const {name,value,type} = e.target;
        setForm((f)=>({...f,[name]:value}))
    }

  return (
    <div className='user-create-form'>
        <h2>User Edit</h2>
      <form onSubmit={handleSubmit}>
        <label>Username : </label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <label>Email : </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {/* <label>Password : </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          
        /> */}
        <label>First_name : </label>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <label>Last_name : </label>
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
        >
          Update
        </button>

      </form>
    </div>
  )
}
