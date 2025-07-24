import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router'
import { deleteCategory, fetchCategory } from '../services/CategoryApi';
import '../components/css/Category.css'


export const CategoryDetails = () => {
    const {CatId} = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState();

    useEffect(()=>{
        console.log("[Individual Category Processing]")
        console.log(CatId)

        const loadCategory = async()=>{
            try{
                const data = await fetchCategory(CatId);
                console.log(data);
                setCategory(data);
            }catch(error){
                throw error;
            }
        }
        loadCategory();
    },[])

  function handleUpdate(){
    navigate(`/categories/${CatId}/edit`)
  }

  async function handleDelete(){
    const decision=confirm("Are you sure?")
    console.log("-------------------->>>>>>",decision)
    if(decision){
      try{
        await deleteCategory(CatId)
        alert("Deleted Successfully !");
        navigate("/authors")
      }catch(error){
        throw error;
      }
    }
  }


    if(!category) return <h2>Loading Category details....</h2>


  return (
    <div className='category-details'>
        <h2>{category.name}</h2>
        <p><strong>Description : </strong>{category.description}</p>
        <p><strong>Book Count : </strong>{category.book_count}</p>
        {category.top_books.length>0 && (
            <>
                <h3>Top Books : </h3>
                <ul style={{listStyle:"none"}}>
                    {category.top_books?.map((b)=>(
                        <li key={b.id} className='details-book-container'>
                            <p><strong><span>{b.title}</span></strong></p>
                            <p><strong>Author : </strong>{b.author?.name || "N/A"}</p>
                            <p><strong>Average_Rating : </strong>{b.average_rating || 0}</p>
                        </li>
                    ))}
                </ul>
            </>
        )}

        <div className='details-button'>
            <NavLink className={"details-nav"} to={'/categories'}>back</NavLink>
            <button className='details-nav' onClick={handleUpdate}>Update</button>
            <button className='details-nav' onClick={handleDelete}>Delete</button>
      </div>

    </div>
  )
}

