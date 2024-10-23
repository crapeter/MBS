package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class MovieService {
  @Autowired
  private MovieRepo movieRepo;

  @Autowired
  private TheaterRepo theaterRepo;

  public ResponseEntity<String> addMovie(Movie newMovie) {
    List<Movie> movies = movieRepo.findByDirectorAndTitle(newMovie.getDirector(), newMovie.getTitle());
    if (!movies.isEmpty())
      return ResponseEntity.badRequest().body("Movie already exists");

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

  public Iterable<MovieDto> getMoviesByTitle(String title) {
    return Mapper.mapToMList(movieRepo.findByTitle(title));
  }

  public MovieDto getMovie(String title, String director) {
    List<Movie> movies = movieRepo.findByDirector(director);
    for (Movie movie : movies) {
      if (movie.getTitle().equalsIgnoreCase(title))
        return Mapper.mapToDto(movie);
    }
    return null;
  }

  public ResponseEntity<String> addToTheater(Long theaterId, Long movieId, String time) {
    Movie movie = movieRepo.findById(movieId).orElse(null);
    Theater theater = theaterRepo.findById(theaterId).orElse(null);

    if (movie == null || theater == null)
      return ResponseEntity.badRequest().body("Theater or movie not found");

    if (!theater.getTimes().contains(time))
      return ResponseEntity.badRequest().body("Theater does not have that time slot");

    if (theater.getMovieId().contains(movieId))
      return ResponseEntity.badRequest().body("Movie already added to theater");

    List<Long> movieIds = theater.getMovieId();
    List<LocalTime> timesLoc = theater.getTimes();
    List<String> times = Mapper.mapToStringList(timesLoc);
    int idx = times.indexOf(time);
    movieIds.add(idx, movieId);

    try {
      theaterRepo.save(theater);
      return ResponseEntity.ok("Movie added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to add movie to theater");
    }
  }

  public ResponseEntity<Long> getMovieId(String title, String director, String time) {
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

  public ResponseEntity<String> updatePrice(Long movieId, double newPrice) {
    return updateStat(movieId, "price", newPrice);
  }

  public ResponseEntity<String> updatePlaying(Long movieId, boolean isPlaying) {
    return updateStat(movieId, "playing", isPlaying);
  }

  public ResponseEntity<String> getPlaying() {
    List<Movie> movies = movieRepo.findAll();
    StringBuilder playing = new StringBuilder();
    for (Movie movie : movies) {
      if (movie.isPlaying())
        playing.append(movie.getTitle())
            .append(" is playing")
            .append("\n");
    }
    return ResponseEntity.ok(playing.toString());
  }

  public ResponseEntity<String> getNotPlaying() {
    List<Movie> movies = movieRepo.findAll();
    StringBuilder notPlaying = new StringBuilder();
    for (Movie movie : movies) {
      if (!movie.isPlaying())
        notPlaying.append(movie.getTitle())
            .append(" will be playing")
            .append("\n");
    }
    return ResponseEntity.ok(notPlaying.toString());
  }

  private ResponseEntity<String> updateStat(Long movieId, String statName, Object stat) {
    Movie movie = movieRepo.findById(movieId).orElse(null);
    if (movie == null)
      return ResponseEntity.badRequest().body("Movie not found");

    try {
      switch (statName) {
        case "price" -> movie.setPrice((double) stat);
        case "playing" -> movie.setPlaying((boolean) stat);
      }
      movieRepo.save(movie);
      return ResponseEntity.ok(statName + " updated successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to update " + statName);
    }
  }
}
