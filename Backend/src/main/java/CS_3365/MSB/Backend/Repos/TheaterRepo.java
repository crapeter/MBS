package CS_3365.MSB.Backend.Repos;

import CS_3365.MSB.Backend.Models.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RestResource
public interface TheaterRepo extends JpaRepository<Theater, Long> {
  Theater findByMovieId(Long movieId);
  Theater findByLocationAndRoomNumber(String location, int roomNumber);
  List<Theater> findByLocation(String location);
}
