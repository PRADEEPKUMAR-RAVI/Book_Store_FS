import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { createReviews } from '../services/ReviewsApi';
import '../components/css/Review.css'

export const CreateReview = () => {
    const {BookId} = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        content: "",
        rating: 0
    })

    function handleChange(e){
        const {name,type,value} = e.target;
        setForm((f)=>({...f, [name]:value}))
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const res = await createReviews(BookId,form);
            navigate(`/books/${BookId}/reviews/${res.id}`)
            if(!res && !res.id){
                navigate(`/books/${BookId}/reviews/${res.id}`)
            }
        }catch(error){
            alert("You are not Authorized !!")
            console.error("create failed",error);
        }
    }

  return (
    <div className='review-create-form'>
        <h2>Review Create</h2>
        <form onSubmit={handleSubmit}>
            <label >Comment : </label>
            <textarea type="text" name="comment" value={form.comment} onChange={handleChange}></textarea>
            <label>Rating : </label>
            <input type="number" name="rating" value={form.rating} onChange={handleChange} required />

            <button type='submit'>Create</button>
        </form>

    </div>
  )
}
