import React, { /* useState */ } from "react";
import { useAuth } from "../Misc/AuthContext";
import { /* Form, */ Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"
// import axios from 'axios'

const Movies = () => {
	const { isLoggedIn, isAdmin } = useAuth()

	const onLoggedIn = () => {
		alert(`isLoggedIn: ${isLoggedIn}`)
	}

	const onAdmin = () => {
		alert(`isAdmin: ${isAdmin}`)
	}

	return (
		<div>
			{isLoggedIn ? (
				<div>
					<h1>Movie List</h1>
					<Button variant="primary" onClick={onLoggedIn}>
						see stuff
					</Button>

					{isAdmin ? (
						<Button variant="primary" onClick={onAdmin}>
							see admin stuff
						</Button>
					) : {}}

				</div>
			) : (
				<div>
					<h1>Please log in to view movies</h1>
				</div>
			)}
		</div>
	)
}

export default Movies;