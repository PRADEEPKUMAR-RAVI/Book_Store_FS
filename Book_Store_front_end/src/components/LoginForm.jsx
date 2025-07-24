import React, { useState } from 'react'
import { userLogin } from '../services/AuthApi'
import { useNavigate } from 'react-router';

export const LoginForm = () => {

    const [form, setForm] = useState({
        username: "",
        password:""
    });
    const navigate = useNavigate();

    function handleChange(e){
        const {type,value,name} = e.target
        setForm((f)=>({...f, [name]:value}))
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const data = await userLogin(form);
            localStorage.setItem('access_token', data.access_token);
            
            if(data.user){
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            navigate('/')
        }catch(error){
            console.log(error);
            alert("Login Failed, Please try again..")
        }
    }
  return (
    <div className='login-form'>
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                required
            />
            <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    </div>
  )
}
