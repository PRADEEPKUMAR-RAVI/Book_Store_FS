import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { fetchCategories } from '../services/CategoryApi';
import { CategoryItems } from '../components/CategoryItems';

export const CategoriesHome = () => {
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("[Fetching - Categories]")
        const loadAll = async()=>{
            try{
                const data = await fetchCategories();
                console.log(data);
                setCategories(data);
            }catch(error){
                throw error;
            }
        }

        loadAll();
    },[]);

    function handleCreate(){
        navigate("/categories/create")
    }

  return (
    <div className='category-home'>
        <div className='category-header'>
            <h2>Categories List</h2>
            <button onClick={handleCreate}>Create</button>
        </div>

        <ul className='category-ul-list'>
            {categories.map((category)=>{
                return <CategoryItems key={category.id} category={category} />
            })}
        </ul>

    </div>
  )
}
