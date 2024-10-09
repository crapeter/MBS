package CS_3365.MSB.Backend.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tickets")
public class Ticket {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @JsonProperty("numberPurchased")
  private int numberPurchased;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "MovieId", nullable = false)
  @JsonProperty("movieId")
  private Movie movie;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TheaterId", nullable = false)
  @JsonProperty("theaterId")
  private Theater theater;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "UserId", nullable = false)
  @JsonProperty("userId")
  private User user;
}
