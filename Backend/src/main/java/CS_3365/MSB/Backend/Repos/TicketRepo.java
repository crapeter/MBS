package CS_3365.MSB.Backend.Repos;

import CS_3365.MSB.Backend.Models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RestResource
public interface TicketRepo extends JpaRepository<Ticket, Long> {
  List<Ticket> findByUserId(long userId);

  Ticket findByUserIdAndMovieId(long userId, long movieId);

  Ticket findByUserIdAndMovieIdAndTheaterId(long userId, long movieId, long theaterId);

  List<Ticket> findByMovieIdAndTheaterIdAndRoomNumber(Long movieId, Long theaterId, int roomNumber);

  Ticket findByUserIdAndMovieIdAndTheaterIdAndRoomNumberAndTime(Long userId, Long movieId, Long theaterId, int roomNumber, String time);
}
