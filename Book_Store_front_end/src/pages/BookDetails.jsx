import React, { useState,useEffect } from 'react'
import { NavLink, useParams } from 'react-router'
import { fetchBook } from '../services/BooksApi';
import { deleteBook } from '../services/BooksApi';
import { useNavigate } from 'react-router';
import '../components/css/Books.css'


export const BookDetails = () => {
    const {BookId} = useParams();
    const navigate = useNavigate()

    const [book,setBook] = useState(null)

    useEffect(()=>{
        console.log("[useEffects run -fetching book]")
        const loadBook = async()=>{
            try {
                const data = await fetchBook(BookId);
                console.log(data)
                setBook(data)
            }catch(error){
                console.log("failed to fetch books",error)
                throw error
            }
        }
        loadBook()
    },[])

    async function handleDelete(){
        const decision = confirm("Are you sure ..?");
        if(decision){
            try{
                await deleteBook(BookId);
                alert("Book Deleted Successfully");
                navigate('/');
            }catch(error){
                throw error
            }
        }
    }

    async function handleUpdate(){
        navigate(`/books/${BookId}/edit`)        
    }

    async function handleReviews() {
        navigate(`/books/${BookId}/reviews`)        
    }

    if (!book) return <p>Loading book details...</p>;

  return (
        <div className='book-details'>
            <h2>{book.name}</h2>
            <p><strong>Description:</strong> {book.description || 'No description available'}</p>

            <h3>Author</h3>
            <p><strong>Name:</strong> {book.author?.name || 'Unknown Author'}</p>

            <h3>Publication Info</h3>
            <p><strong>Language:</strong> {book.language || 'N/A'}</p>
            <p><strong>Pages:</strong> {book.page_count}</p>
            <p><strong>Published Date:</strong> {book.publication_date}</p>
            <p><strong>Is Published:</strong> {book.is_published ? 'Yes' : 'No'}</p>

            <h3>Categories</h3>
            <ul style={{listStyle:"none"}}>
            {book.categories?.length > 0 ? (
                book.categories.map((cat) => (
                <li style={{margin:"3px",fontFamily:"fantasy", color:"rgba(65, 73, 194, 0.6)"}} key={cat.id}>{cat.name}</li>
                ))
            ) : (
                <li>No categories listed</li>
            )}
            </ul>

            <h3>Reviews & Ratings</h3>
            <p><strong>Total Reviews:</strong> {book.total_reviews}</p>
            <p><strong>Average Rating:</strong> {book.average_rating}</p>
            <button className='details-nav' onClick={handleReviews}>See Reviews</button>

            <h3>Date</h3>
            <p><strong>Created At:</strong> {new Date(book.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(book.updated_at).toLocaleString()}</p>
            <div className='details-button'>
                <NavLink className={"details-nav"} to={'/'}>back</NavLink>
                <button className='details-nav' onClick={handleUpdate}>Update</button>
                <button className='details-nav' onClick={handleDelete}>Delete</button>
            </div>
            
        </div>
  )
}
