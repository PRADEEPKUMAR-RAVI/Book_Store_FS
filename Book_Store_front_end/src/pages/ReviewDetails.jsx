import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router'
import { deleteReview, fetchReview } from '../services/ReviewsApi';
import { fetchBook } from '../services/BooksApi';
import '../components/css/Review.css'

export const ReviewDetails = () => {
    const {BookId,ReviewId} = useParams();
    const [review, setReview] = useState(null);
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
      console.log("[useEffects - fetching individual Review]")
      const loadReview = async()=>{
        try{
          const bdata = await fetchBook(BookId);
          const data = await fetchReview(BookId,ReviewId);  
          setReview(data);
          setBook(bdata);
        }catch(error){
          console.log(error)
          throw error;
        }
      }
      loadReview();
    },[])
    if(!review) return <h2>Loading details.. !! </h2>
    if(!book) return <h2>Loading details.. !! </h2>

    async function handleDelete(){
        const decision = confirm("Are you sure ..?");
        if(decision){
            try{
                await deleteReview(BookId,ReviewId);
                alert("Review Deleted Successfully");
                navigate(`/books/${BookId}/reviews`);
            }catch(error){
                throw error
            }
        }
    }

    async function handleUpdate(){
        navigate(`/books/${BookId}/reviews/${ReviewId}/edit`)        
    }

  return (
    <div className='review-details'>
      <h2>Book : {book.name}</h2>
      <h3>Author : {book.author?.name || "N/A"}</h3>
      <p><strong>Comment : </strong>{review.comment}</p>
      <p><strong>Rating : </strong>{review.rating}</p>

      <h3>Timings : </h3>
      <p><strong>Created At : </strong>{new Date(review.created_at).toLocaleString()}</p>
      <p><strong>Updated At : </strong>{new Date(review?.updated_at).toLocaleString() || "Not Updated"}</p>

      <div className='details-button'>
          <NavLink className={"details-nav"} to={`/books/${BookId}/reviews`}>back</NavLink>
          <button className='details-nav' onClick={handleUpdate}>Update</button>
          <button className='details-nav' onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}
