import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { fetchCategory, updateCategory } from '../services/CategoryApi';
import '../components/css/Category.css'

export const EditCategory = () => {
    const {CatId} = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name : "",
        description : ""
    });

    useEffect(()=>{
        const loadCategory = async()=>{
            try{
                const category = await fetchCategory(CatId);
                console.log(category);
                setForm({
                    name: category.name || "",
                    description: category.description || ""

                })
            }catch(error){
                throw error;
            }
        }
        loadCategory();
    },[]);

    async function handleSubmit(e){
        e.preventDefault();
        try{
            await updateCategory(CatId,form);
            alert("Category Updated Successfully");
            navigate(`/categories/${CatId}`)
        }catch(error){
            console.error("Update failed",error);
        }
    }

    function handleChange(e){
        const {name,type,value} = e.target;
        setForm((f)=>({...f, [name]:value}))
    }


  return (
    <div className='category-edit-form'>
        <h2>Category Edit</h2>
        <form action="" onSubmit={handleSubmit}>
            <label>Category name : </label>
            <input type="text" name='name' value={form.name} onChange={handleChange}/>
            <label>Description : </label>
            <textarea type="text" name='description' value={form.description} onChange={handleChange}/>

            <button type='submit'>Update</button>
        </form>
    </div>
  )
}
