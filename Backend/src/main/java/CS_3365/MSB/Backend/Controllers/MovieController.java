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
  public ResponseEntity<Long> getMovieId(
      @RequestParam String title, @RequestParam String director, @RequestParam String time
  ) {
    return movieService.getMovieId(title, director, time);
  }

  @GetMapping("/all")
  public Iterable<MovieDto> getAllMovies() {
    return movieService.getAllMovies();
  }

  @GetMapping("/unique")
  public MovieDto getMovie(@RequestParam String title, @RequestParam String director) {
    return movieService.getMovie(title, director);
  }

  @GetMapping("/get/playing")
  public ResponseEntity<String> getPlaying() {
    return movieService.getPlaying();
  }
 
  @GetMapping("/get/not/playing")
  public ResponseEntity<String> getNotPlaying() {
    return movieService.getNotPlaying();
  }

  @GetMapping("/get/by/title")
  public Iterable<MovieDto> getMoviesByTitle(@RequestParam String title) {
    return movieService.getMoviesByTitle(title);
  }

  @PatchMapping("/add/to/theater")
  public ResponseEntity<String> addTheater(
      @RequestParam Long theaterId, @RequestParam Long movieId, @RequestParam String time
  ) {
    return movieService.addToTheater(theaterId, movieId, time);
  }

  @PatchMapping("/update/price")
  public ResponseEntity<String> updatePrice(@RequestParam Long movieId, @RequestParam double newPrice) {
    return movieService.updatePrice(movieId, newPrice);
  }

  @PatchMapping("/update/playing")
  public ResponseEntity<String> updatePlaying(@RequestParam Long movieId, @RequestParam boolean isPlaying) {
    return movieService.updatePlaying(movieId, isPlaying);
  }

  @DeleteMapping("/delete/{movieId}")
  public ResponseEntity<String> deleteMovie(@PathVariable Long movieId) {
    return movieService.deleteMovie(movieId);
  }
}
