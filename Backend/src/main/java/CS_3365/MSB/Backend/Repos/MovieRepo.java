package CS_3365.MSB.Backend.Repos;

import CS_3365.MSB.Backend.Models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

@RestResource
public interface MovieRepo extends JpaRepository<Movie, Long> {
}
