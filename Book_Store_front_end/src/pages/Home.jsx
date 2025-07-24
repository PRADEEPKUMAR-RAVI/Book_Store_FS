import React, { useEffect, useState } from 'react'
import { fetchBooks } from '../services/BooksApi';
import {BookItems} from '../components/BookItems'
import { Outlet, useNavigate } from 'react-router';

//It list all Books

export const Home = () => {
    const navigate = useNavigate()
    const [books, setBooks] = useState([]);

    useEffect(()=>{
        console.log("[useEffects run -fetching books]")
        const loadBooks = async()=>{
            try {
                const data = await fetchBooks();
                console.log(data)
                setBooks(data)
            }catch(error){
                console.log("failed to fetch books",error)
                throw error
            }
        }
        loadBooks()
    },[])

    function handleCreate(){
        navigate("books/create")
    }


  return (
    <div className='home-page'>
        <div className='home-head'>
            <h2>Book List</h2>
            <button onClick={handleCreate}>Create</button>
        </div>
        <ul className='book-ul-list'>
            {books.map((book)=>{
                return <BookItems key={book.id} book={book}/>
            })}
        </ul>
        
    </div>
  )
}
