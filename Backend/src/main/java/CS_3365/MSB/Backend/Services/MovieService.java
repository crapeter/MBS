package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class MovieService {
  @Autowired
  private MovieRepo movieRepo;

  public ResponseEntity<String> addMovie(MovieDto newMovie) {
    Movie movie = Mapper.mapToMovie(newMovie);
    try {
      movieRepo.save(movie);
      return ResponseEntity.ok("Movie added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to add movie");
    }
  }

  public Iterable<MovieDto> getAllMovies() {
    return Mapper.mapToMList(movieRepo.findAll());
  }
}
