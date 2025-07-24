import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router'
import { createCategory } from '../services/CategoryApi';
import '../components/css/Category.css'

export const CreateCategory = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name:"",
        description: ""
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const res = await createCategory(form);
            navigate(`/categories/${res.id}`)
        }catch(error){
            console.error("create failed", error);
        }
    }

    function handleChange(e){
        const {name,type,value} = e.target;
        setForm((f)=>({...f, [name]:value}))
    }



  return (
    <div className='category-edit-form'>
        <h2>Category Creation</h2>
        <form action="" onSubmit={handleSubmit}>
            <label>Category name : </label>
            <input type="text" name='name' value={form.name} onChange={handleChange}/>
            <label>Description : </label>
            <textarea type="text" name='description' value={form.description} onChange={handleChange}/>

            <button type='submit'>Create</button>
        </form>
    </div>
  )
}
