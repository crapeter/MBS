package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {
  @Autowired
  private MovieRepo movieRepo;

  @Autowired
  private TheaterRepo theaterRepo;

  public ResponseEntity<String> addMovie(Movie newMovie) {
    try {
      movieRepo.save(newMovie);
      return ResponseEntity.ok("Movie added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to add movie");
    }
  }

  public Iterable<MovieDto> getAllMovies() {
    return Mapper.mapToMList(movieRepo.findAll());
  }

  public MovieDto getMovie(String title, String director) {
    List<Movie> movies = movieRepo.findByDirector(director);
    for (Movie movie : movies) {
      if (movie.getTitle().equalsIgnoreCase(title))
        return Mapper.mapToDto(movie);
    }
    return null;
  }

  public ResponseEntity<String> addToTheater(Long theaterId, Long movieId) {
    Movie movie = movieRepo.findById(movieId).orElse(null);
    Theater theater = theaterRepo.findById(theaterId).orElse(null);

    if (movie == null || theater == null)
      return ResponseEntity.badRequest().body("Theater or movie not found");

    theater.setMovie(movie);
    movie.getTheaters().add(theater);
    return ResponseEntity.ok("Theater added successfully");
  }

  public ResponseEntity<Long> getMovieId(String title, String director) {
    List<Movie> movies = movieRepo.findByDirector(director);
    for (Movie movie : movies) {
      if (movie.getTitle().equalsIgnoreCase(title))
        return ResponseEntity.ok(movie.getId());
    }
    return ResponseEntity.badRequest().body(-1L);
  }

  public ResponseEntity<String> deleteMovie(Long movieId) {
    Movie movie = movieRepo.findById(movieId).orElse(null);
    if (movie == null)
      return ResponseEntity.badRequest().body("Movie not found");

    try {
      movieRepo.delete(movie);
      return ResponseEntity.ok("Movie deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to remove movie");
    }
  }
}
