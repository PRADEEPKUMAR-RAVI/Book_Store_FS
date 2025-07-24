import React from 'react'
import { useNavigate } from 'react-router'
import './css/Category.css'

export const CategoryItems = ({category}) => {
    const navigate = useNavigate()

    function handleClick(){
        navigate(`/categories/${category.id}`)
    }

  return (
    <div>

        <li className='category-items-list' onClick={handleClick}>
            <h3><strong>Category : </strong><span>{category.name}</span></h3>
            <p><strong>Description : </strong>{category.description}</p>
            <p><strong>Book Count : </strong>{category.book_count}</p>
        </li>

    </div>
  )
}

