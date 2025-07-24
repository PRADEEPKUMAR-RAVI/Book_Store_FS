import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router'
import { fetchAuthor } from '../services/AuthorApi';
import { deleteAuthor } from '../services/AuthorApi';
import { useNavigate } from 'react-router';
import '../components/css/Author.css'

export const AuthorDetails = () => {
  const navigate = useNavigate()
  const {AuthorId} = useParams();
  const [author, setAuthor] = useState(null)
  

  useEffect(()=>{
    console.log("[Individual author processing]");
    console.log(AuthorId)
    const loadAuthor=async()=>{
      try{
        const data = await fetchAuthor(AuthorId);
        console.log(data);
        setAuthor(data)
      }catch(error){
        console.log("failed to fetch",error);
        throw error;
      }
    }

    loadAuthor();
  },[])

  function handleUpdate(){
    navigate(`/authors/${AuthorId}/edit`)
  }

  async function handleDelete(){
    const decision=confirm("Are you sure?")
    console.log("-------------------->>>>>>",decision)
    if(decision){
      try{
        await deleteAuthor(AuthorId)
        alert("Deleted Successfully !");
        navigate("/authors")
      }catch(error){
        throw error;
      }
    }
  }

  if (!author) return <p>Loading author details...</p>;

  return (
    <div className='author-details'>
      <h2>{author.name}</h2>
      <p><strong>Biography : </strong>{author.biography}</p>
      <p><strong>Age : </strong>{author.age}</p>
      <p><strong>Gender : </strong>{author.gender}</p>
      <p><strong>Country : </strong>{author.country}</p>

      <h3>Awards</h3>
      <ul style={{listStyle:"none"}}>
        {author.awards?.map((a,index)=>(
          <li  key={index}>{a}</li>
        ))}
      </ul>

      <h3>Books</h3>
      <ul style={{listStyle:"none"}}>
        {author.books?.map((b)=>(
          <li key={b.id}>{b.name}</li> 
        ))}
      </ul>
      <p><strong>Book Count : </strong>{author.books.length || 0}</p>
      <p><strong>Total Published : </strong>{author.total_published}</p>
      <div className='details-button'>
        <NavLink className={"details-nav"} to={'/authors'}>back</NavLink>
        <button className='details-nav' onClick={handleUpdate}>Update</button>
        <button className='details-nav' onClick={handleDelete}>Delete</button>
      </div>

    </div>
  )
}
