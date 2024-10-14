package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
  @Autowired
  private ReviewService reviewService;

  @GetMapping("/by/user")
  public List<ReviewDto> getReviewsByUser(Long userId) {
    return reviewService.getReviewsByUser(userId);
  }

  @GetMapping("/by/movie")
  public List<ReviewDto> getReviewsByMovie(Long movieId) {
    return reviewService.getReviewsByMovie(movieId);
  }
}
