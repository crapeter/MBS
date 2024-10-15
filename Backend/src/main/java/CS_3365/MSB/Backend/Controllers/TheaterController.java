package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.TheaterDto;
import CS_3365.MSB.Backend.Services.TheaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/theaters")
public class TheaterController {
  @Autowired
  private TheaterService theaterService;

  @PostMapping("/add")
  public ResponseEntity<String> addTheater(@RequestBody TheaterDto theaterDto) {
    return theaterService.addTheater(theaterDto);
  }

  @GetMapping("/get/id")
  public ResponseEntity<Long> getTheaterId(@RequestParam String location, @RequestParam int roomNumber) {
    return theaterService.getTheaterId(location, roomNumber);
  }

  @PatchMapping("/change/movie")
  public ResponseEntity<String> updateMovie(@RequestParam Long theaterId, @RequestParam Long movieId) {
    return theaterService.updateMovie(theaterId, movieId);
  }

  @DeleteMapping("/delete/{theaterId}")
  public ResponseEntity<String> deleteTheater(@PathVariable Long theaterId) {
    return theaterService.deleteTheater(theaterId);
  }
}
