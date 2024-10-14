package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
  @Autowired
  private ReviewRepo reviewRepo;

  public List<ReviewDto> getReviewsByUser(Long userId) {
    List<Review> reviews = reviewRepo.findByUserId(userId);
    return Mapper.mapToRList(reviews);
  }

  public List<ReviewDto> getReviewsByMovie(Long movieId) {
    List<Review> reviews = reviewRepo.findByMovieId(movieId);
    return Mapper.mapToRList(reviews);
  }
}
