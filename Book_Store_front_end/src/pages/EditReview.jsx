import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { fetchReview, updateReviews } from '../services/ReviewsApi';
import '../components/css/Review.css'

export const EditReview = () => {
    const {BookId,ReviewId} = useParams();
    const navigate = useNavigate()
    const [form, setForm] = useState({
        comment: "",
        rating: 0
    });

    useEffect(()=>{
        const loadReview = async()=>{
            try{
                const data = await fetchReview(BookId,ReviewId);
                setForm({
                    comment:data.comment || "",
                    rating: data.rating || 0
                })
            }catch(error){
                throw error;
            }
        }

        loadReview();
    },[]);


    async function handleSubmit(e){
        e.preventDefault();
        try{
            await updateReviews(BookId,ReviewId,form);
            alert("Review Updated Successfully");
            navigate(`/books/${BookId}/reviews/${ReviewId}`)
        }catch(error){
            console.error("Update failed",error);
            alert("You are not Authorized !!")
        }
    }

    function handleChange(e){
        const {name,type,value} = e.target;
        setForm((f)=>({...f, [name]:value}))
    }

  return (
    <div className='review-create-form'>
        <h2>Review Edit</h2>
        <form onSubmit={handleSubmit}>
            <label >Comment : </label>
            <textarea type="text" name="comment" value={form.comment} onChange={handleChange}></textarea>
            <label>Rating : </label>
            <input type="number" name="rating" value={form.rating} onChange={handleChange} required />

            <button type='submit'>Update</button>
        </form>

    </div>
  )
}
