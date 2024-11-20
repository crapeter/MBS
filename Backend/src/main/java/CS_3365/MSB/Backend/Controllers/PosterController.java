package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.PosterDTO;
import CS_3365.MSB.Backend.Services.PosterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/posters")
public class PosterController {
  @Autowired
  private PosterService posterService;

  @PostMapping("/upload")
  public ResponseEntity<String> uploadPoster(
      @RequestParam("poster") MultipartFile file,
      @RequestParam("movieId") Long movieId,
      @RequestParam("title") String title
  ) {
    boolean success = posterService.uploadPoster(file, movieId, title);
    return success ?
        ResponseEntity.ok("Poster uploaded successfully") :
        ResponseEntity.badRequest().body("Failed to upload poster");
  }

  @GetMapping("/get/{movieId}")
  public ResponseEntity<String> getPoster(@PathVariable Long movieId) {
    String poster = posterService.getPoster(movieId);
    return poster == null ?
        ResponseEntity.badRequest().body("No poster found") :
        ResponseEntity.ok(poster);
  }

  @GetMapping("get")
  public List<PosterDTO> getPosters() {
    return posterService.getPosters();
  }
}
