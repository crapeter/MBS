package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movies")
public class MovieController {
  @Autowired
  private MovieService movieService;

  @PostMapping("/new/movie")
  public ResponseEntity<String> newMovie(@RequestBody Movie newMovie) {
    return movieService.addMovie(newMovie);
  }

  @GetMapping("/get/id")
  public ResponseEntity<Long> getMovieId(@RequestParam String title, @RequestParam String director) {
    return movieService.getMovieId(title, director);
  }

  @GetMapping("/all")
  public Iterable<MovieDto> getAllMovies() {
    return movieService.getAllMovies();
  }

  @GetMapping("/unique")
  public MovieDto getMovie(@RequestParam String title, @RequestParam String director) {
    return movieService.getMovie(title, director);
  }

  @PatchMapping("/add/theater")
  public ResponseEntity<String> addTheater(@RequestParam Long theaterId, @RequestParam Long movieId) {
    return movieService.addToTheater(theaterId, movieId);
  }

  @DeleteMapping("/delete/{movieId}")
  public ResponseEntity<String> deleteMovie(@PathVariable Long movieId) {
    return movieService.deleteMovie(movieId);
  }
}
