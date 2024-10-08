package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.*;
//import CS_3365.MSB.Backend.Models.*;
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
  public ResponseEntity<String> newMovie(@RequestBody MovieDto newMovie) {
    return movieService.addMovie(newMovie);
  }

  @GetMapping("/all")
  public Iterable<MovieDto> getAllMovies() {
    return movieService.getAllMovies();
  }
}
