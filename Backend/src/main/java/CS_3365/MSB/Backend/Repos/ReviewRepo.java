package CS_3365.MSB.Backend.Repos;

import CS_3365.MSB.Backend.Models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RestResource
public interface ReviewRepo extends JpaRepository<Review, Long> {
  List<Review> findByUserId(Long userId);
  List<Review> findByMovieId(Long movieId);
}
