const baseURL = "http://localhost:3000/films";
const filmsList = document.getElementById("films");
const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieRuntime = document.getElementById("movie-runtime");
const movieShowtime = document.getElementById("movie-showtime");
const movieDescription = document.getElementById("movie-description");
const movieTickets = document.getElementById("movie-tickets");
const buyTicketButton = document.getElementById("buy-ticket");

// Fetch all movies and populate the movie list
fetch(baseURL)
    .then(response => response.json())
    .then(movies => {
        filmsList.innerHTML = ""; // Clear placeholder
        movies.forEach(movie => renderMovieItem(movie));
        displayMovieDetails(movies[0]); // Show the first movie's details
    });

// Render movie list item
function renderMovieItem(movie) {
    const li = document.createElement("li");
    li.textContent = movie.title;
    li.dataset.id = movie.id;
    li.classList.add("film-item");

    // Check if the movie is sold out
    if (movie.capacity - movie.tickets_sold === 0) {
        li.classList.add("sold-out");
    }

    li.addEventListener("click", () => {
        fetch(`${baseURL}/${movie.id}`)
            .then(response => response.json())
            .then(movieData => displayMovieDetails(movieData));
    });

    filmsList.appendChild(li);
}

// Display selected movie details
function displayMovieDetails(movie) {
    moviePoster.src = movie.poster;
    movieTitle.textContent = movie.title;
    movieRuntime.textContent = movie.runtime;
    movieShowtime.textContent = movie.showtime;
    movieDescription.textContent = movie.description;
    const availableTickets = movie.capacity - movie.tickets_sold;
    movieTickets.textContent = availableTickets > 0 ? availableTickets : "Sold Out";

    // Enable/disable buy ticket button
    buyTicketButton.disabled = availableTickets === 0;
    buyTicketButton.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";

    // Set button event
    buyTicketButton.onclick = () => buyTicket(movie);
}

// Buy Ticket function
function buyTicket(movie) {
    let availableTickets = movie.capacity - movie.tickets_sold;

    if (availableTickets > 0) {
        movie.tickets_sold++;

        // Update server
        fetch(`${baseURL}/${movie.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tickets_sold: movie.tickets_sold })
        }).then(() => {
            displayMovieDetails(movie);
        });
    }
}

// Delete film from server
filmsList.addEventListener("contextmenu", event => {
    event.preventDefault();
    if (event.target.tagName === "LI") {
        const movieId = event.target.dataset.id;
        fetch(`${baseURL}/${movieId}`, { method: "DELETE" })
            .then(() => event.target.remove());
    }
});
