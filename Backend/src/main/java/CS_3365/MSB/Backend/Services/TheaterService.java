package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.MovieRepo;
import CS_3365.MSB.Backend.Repos.TheaterRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class TheaterService {
  @Autowired
  private TheaterRepo theaterRepo;

  @Autowired
  private MovieRepo movieRepo;

  private static final String[] locations = {"Lubbock", "Amarillo", "Levelland", "Plainview", "Snyder", "Abilene"};

  public ResponseEntity<String> addTheater(TheaterDto theaterDto) {
    List<Theater> theaters = theaterRepo.findByLocation(theaterDto.getLocation());
    for (Theater theater : theaters) {
      if (theater.getRoomNumber() == theaterDto.getRoomNumber()) {
        return ResponseEntity.badRequest().body("Theater already exists");
      }
    }

    if (theaterDto.getRoomNumber() < 1) {
      return ResponseEntity.badRequest().body("Invalid room number");
    }

    if (!Arrays.asList(locations).contains(theaterDto.getLocation())) {
      return ResponseEntity.badRequest().body("Invalid location");
    }

    Theater theater = Mapper.mapToTheater(theaterDto);
    theater.setMovieId(null);
    try {
      theaterRepo.save(theater);
      return ResponseEntity.ok("Theater added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to add theater");
    }
  }

  public ResponseEntity<String> updateMovie(Long theaterId, Long movieId) {
    Theater theater = theaterRepo.findById(theaterId).orElse(null);
    Movie movie = movieRepo.findById(movieId).orElse(null);

    if (movie == null || theater == null) {
      return ResponseEntity.badRequest().body("Theater or movie not found");
    }

    List<Theater> theaters = theaterRepo.findByLocation(theater.getLocation());
    for (Theater t : theaters) {
      if (Objects.equals(t.getId(), theaterId)) continue;

      if (t.getMovieId().equals(movieId)) {
        return ResponseEntity.badRequest().body("Movie already playing in another theater");
      }
    }

    theater.setMovieId(movieId);
    try {
      theaterRepo.save(theater);
      return ResponseEntity.ok("Movie updated successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to update movie");
    }
  }

  public ResponseEntity<Long> getTheaterId(String location, int roomNumber) {
    Theater theater = theaterRepo.findByLocationAndRoomNumber(location, roomNumber);
    if (theater == null) {
      return ResponseEntity.badRequest().body(-1L);
    }
    return ResponseEntity.ok(theater.getId());
  }

  public ResponseEntity<String> deleteTheater(Long theaterId) {
    Theater theater = theaterRepo.findById(theaterId).orElse(null);
    if (theater == null)
      return ResponseEntity.badRequest().body("Theater not found");

    try {
      theaterRepo.delete(theater);
      return ResponseEntity.ok("Theater deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to delete theater");
    }
  }

  public List<TheaterDto> getTheatersByLocation(String location) {
    List<Theater> theaters = theaterRepo.findByLocation(location);
    List<TheaterDto> theaterDtos = Mapper.mapToThList(theaters);
    theaterDtos.forEach(theaterDto -> theaterDto.setLocation(location));
    return theaterDtos;
  }

  public List<TheaterDto> getAllTheaters() {
    List<Theater> theaters = theaterRepo.findAll();
    return Mapper.mapToThList(theaters);
  }
}
