package CS_3365.MSB.Backend.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "posters")
public class Poster {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "PosterId")
  private Long id;

  @JsonProperty("MovieId")
  @Column(name = "MovieId", nullable = false)
  private Long movieId;

  @JsonProperty("title")
  @Column(name = "title", nullable = false)
  private String title;

  @JsonProperty("image")
  @Column(name = "image", nullable = false)
  private byte[] image;
}
