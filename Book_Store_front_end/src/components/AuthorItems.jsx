import React from 'react'
import { useNavigate } from 'react-router'
import './css/Author.css'

export const AuthorItems = ({author}) => {
    const navigate = useNavigate()

    
    function handleClick(){
        navigate(`/authors/${author.id}`)
    }


  return (
    <div>
        <li className='author-items-list' onClick={handleClick}>
            <h3><strong>Author : </strong><span>{author.name}</span></h3>
            <p><strong>Biography : </strong>{author.biography || "N/A"}</p>
            <p><strong>Age : </strong>{author.age || "N/A"}</p>
            <p><strong>Gender : </strong>{author.gender || "N/A"}</p>
            <p><strong>Country : </strong>{author.country || "N/A"}</p>
        </li>
    </div>
  )
}
