import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { fetchReviews } from '../services/ReviewsApi';
import { ReviewItems } from '../components/ReviewItems';
import '../components/css/Review.css'
export const BookReviews = () => {
        const {BookId} = useParams();
        const navigate = useNavigate()
        const [reviews, setReviews] = useState([])


        useEffect(()=>{
            console.log("[Fetching - Reviews]");
            const loadReviews = async()=>{
                try{
                    const data = await fetchReviews(BookId);
                    console.log(data);
                    setReviews(data);
                }catch(error){
                    throw error;
                }
            }
            loadReviews();
        },[]);

    function handleCreate(){
        navigate(`/books/${BookId}/reviews/create`)
    }


    if(reviews.length<1) return (
        <div className='review-container'>
            <h3>No Reviews for This Book..!!</h3>
            <p>Create One...</p>
            <button onClick={handleCreate}>Create</button>
        </div>
    )


  return (
    <div className='review-home'>
        <div className="review-header">
            <h2>Reviews For Books</h2>
            <button onClick={handleCreate}>create</button>
        </div>

        <ul className='review-ul-list'>
            {reviews.map((review)=>{
                return <ReviewItems key={review.id} review={review} BookId={BookId}/>
            })}

        </ul>

    </div>
  )
}


