import React from 'react'
import './css/Books.css'
import { useNavigate } from 'react-router'


export function BookItems({book}) {
    const navigate = useNavigate();
    function handleClick(){
        navigate(`books/${book.id}`)
    };

  return (
    <div>
        <li className='book-items-list' onClick={handleClick}>
            <h3>{book.name}</h3>
            <p><strong>Author : </strong> {book.author?.name}</p>
            <p><strong>Language : </strong> {book.language || "N/A"}</p>
            <p><strong>Page_count : </strong> {book.page_count || "N/A"}</p>
            <p><strong>Average_Rating : </strong> {book.average_rating || "N/A"}</p>
            <p><strong>Published_Date : </strong> {book.publication_date || "N/A"}</p>

            {/* For categories*/}

            <p><strong>{book.categories.length>1?"Categories":"Category"} : </strong> {" "} {book.categories?.map((cat)=>cat.name).join(", ")}</p>

        </li>


    </div>
  )
}

