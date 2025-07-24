import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import {Home} from './pages/Home.jsx'
import './components/css/App.css'
import { BookDetails } from './pages/BookDetails.jsx'
import NavBar from './components/NavBar.jsx'
import LayOut from './components/LayOut.jsx'
import { EditBook } from './pages/EditBook.jsx'
import { CreateBook } from './pages/CreateBook.jsx'
import { AuthorHome } from './pages/AuthorHome.jsx'
import { AuthorDetails } from './pages/AuthorDetails.jsx'
import { EditAuthor } from './pages/EditAuthor.jsx'
import { CreateAuthor } from './pages/CreateAuthor.jsx'
import { UsersHome } from './pages/UsersHome.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { CategoriesHome } from './pages/CategoriesHome.jsx'
import { CategoryDetails } from './pages/CategoryDetails.jsx'
import { EditCategory } from './pages/EditCategory.jsx'
import { CreateCategory } from './pages/CreateCategory.jsx'
import { BookReviews } from './pages/BookReviews.jsx'
import { ReviewDetails } from './pages/ReviewDetails.jsx'
import { EditReview } from './pages/EditReview.jsx'
import { CreateReview } from './pages/CreateReview.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AuthPage from './pages/AuthPage.jsx'
import { EditUser } from './pages/EditUser.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<LayOut/>,
    children:[
      {
        index:true,
        element: <Home />,
        
      },
      {
        path:'/login',
        element:<AuthPage/>
      },
      {
        path:'books/:BookId',
        element: <BookDetails/>
      },
      {
        path:'books/:BookId/edit',
        element: <EditBook/>
      },
      {
        path:'books/create',
        element:<CreateBook />
      },
      {
        path:'authors/',
        element:<AuthorHome/>,
      },
      {
        path:'authors/:AuthorId',
        element:<AuthorDetails/>
      },
      {
        path:'authors/:AuthorId/edit',
        element:<EditAuthor/>
      },
      {
        path:'authors/create',
        element:<CreateAuthor/>
      },
      {
        path:'users/',
        element:<UsersHome/>
      },

      {
        path:'categories/',
        element:<CategoriesHome/>
      },
      {
        path:'categories/:CatId',
        element:<CategoryDetails/>
      },
      {
        path:`categories/:CatId/edit`,
        element:<EditCategory/>
      },
      {
        path:'categories/create',
        element:<CreateCategory/>
      },
      {
        path:'books/:BookId/reviews',
        element:<BookReviews/>
      },
      {
        path:`books/:BookId/reviews/:ReviewId`,
        element:<ReviewDetails/>
      },
      {
        element:<ProtectedRoute/>,
        children:[
          {
            path:'users/:UserId',
            element:<UserDetails/>
          },
          {
            path:'users/:UserId/edit',
            element:<EditUser/>
          },
          {
            path:`books/:BookId/reviews/create`,
            element:<CreateReview/>
          },
          {
            path:'books/:BookId/reviews/:ReviewId/edit',
            element:<EditReview/>
          }
        ]
      }

    ]
  },
  
])

export const App = () => {
  return (
    <div className='app-container'>
      <RouterProvider router={router} />
    </div>
  )
}
