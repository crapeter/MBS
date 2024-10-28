import React, { useEffect, useState } from "react"
import { useAuth } from "../Misc/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from 'react-bootstrap'
import '../../CSS/Reviews.css'
import axios from 'axios'

const Reviews = () => {
  const nav = useNavigate()
  const { movieTitle } = useParams()
  const { isLoggedIn, userEmail } = useAuth()
  const [newReview, setNewReview] = useState('')
  const [reviews, setReviews] = useState([])
  const [movie, setMovie] = useState({})
  const profanaties = ["fuck", "shit", "bitch", "pussy", "pussies", "cunt"]

  useEffect(() => {
    getMovies()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    getReviews()
    // eslint-disable-next-line
  }, [movie])


  const getMovies = async () => {
    try {
      const movies = await axios.get(`/api/movies/get/by/title?title=${movieTitle}`)
      setMovie(movies.data[0])
    } catch (err) {
    }
  }

  const createReview = async () => {
    let allowed = true;
    for (let prof of profanaties) {
      if (newReview.toLowerCase().includes(prof)) {
        allowed = false
      }
    }

    if (!allowed){
      alert("Swear words not allowed")
    } else {
      try {
        const res = await axios.patch(`/api/users/add/review?userEmail=${userEmail}&movieId=${movie.id}&review=${newReview}`)
        alert(res.data)
        window.location.reload()
      } catch (err) {
        alert(err)
      }
    }
  }

  const getReviews = async () => {
    try {
      const res = await axios.get('/api/reviews/by/movie', {
        params: {
          movieId: movie.id
        }
      })
      setReviews(res.data)
    } catch (err) {
    }
  }

  const goBack = () => {
    nav(-1)
  }

  return (
    <div className="top_review_div">
      {isLoggedIn ? (
        <div className="reviews">
          <h1>Reviews for {movie.title}</h1>
          <Button className="return_button" variant="danger" onClick={goBack}>Return</Button>
          <div className="write_new_review">
            <input style={{ font: 'comic sans ms' }}
              value={newReview}
              type="text"
              placeholder="Write a review..."
              onChange={(e) => setNewReview(e.target.value)}
              className="review_input"
            />
            <Button variant="success" onClick={createReview}>Submit</Button>
          </div>
          <div className="written_reviews">
            {reviews.map((review, index) => (
              <div key={index} className="review">
                <h3>{review.name}</h3>
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{ color: "white" }}>Log in to view movies</h1>
        </div>
      )}
    </div>
  )
}

export default Reviews;