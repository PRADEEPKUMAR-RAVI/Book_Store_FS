import React from 'react'
import { useNavigate } from 'react-router'

export const ReviewItems = ({review, BookId}) => {

    const navigate = useNavigate();
    
    function handleClick(){
        navigate(`/books/${BookId}/reviews/${review.id}`)
    }
  return (
    <div>
        <li className='review-items-list' onClick={handleClick}>
            <h3>Review</h3>
            <p><strong>Comment : </strong>{review.comment || "N/A"}</p>
            <p><strong>Rating : </strong>{review.rating}</p>
            <p><strong>Created At : </strong>{new Date(review?.created_at).toLocaleString()}</p>
            <p><strong>Updated At : </strong>{new Date(review?.updated_at).toLocaleString()}</p>
        </li>
    </div>
  )
}
