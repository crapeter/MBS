package CS_3365.MSB.Backend.Repos;

import CS_3365.MSB.Backend.Models.Poster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

@RestResource
public interface PosterRepo extends JpaRepository<Poster, Long> {
  Poster findByMovieId(Long movieId);
}
