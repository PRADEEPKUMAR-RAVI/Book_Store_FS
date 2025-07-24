import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import {fetchAuthors} from '../services/AuthorApi'
import { AuthorItems } from '../components/AuthorItems'

export const AuthorHome = () => {
    const [authors, setAuthors] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        const loadAuthors = async()=>{
            try{
                const data =await fetchAuthors();
                console.log(data);
                setAuthors(data);
            }catch(error){
                console.log("failed to fetch authors",error);
                throw error;
            }
        }
        loadAuthors();
    },[]);

    function handleCreate(){
        navigate("/authors/create")
    }

  return (
    <div className='author-home'>
        <div className='author-header'>
            <h2>Authors List</h2>
            <button onClick={handleCreate}>Create</button>
        </div>
        <ul className='author-ul-list'>
            {authors.map((author)=>{
                return <AuthorItems key={author.id} author={author} />
            })}
        </ul>

        
    </div>
  )
}
