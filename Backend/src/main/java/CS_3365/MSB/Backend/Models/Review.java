package CS_3365.MSB.Backend.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "reviews")
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false)
  @JsonProperty("rating")
  private String review;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "MovieId", nullable = false)
  @JsonProperty("movieId")
  private Movie movie;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "UserId", nullable = false)
  @JsonProperty("userId")
  private User user;
}
