package CS_3365.MSB.Backend.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "movies")
public class Movie {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "MovieId")
  private Long id;

  @JsonProperty("title")
  @Column(name = "title", nullable = false)
  private String title;

  @JsonProperty("description")
  @Column(name = "description", nullable = false)
  private String description;

  @JsonProperty("genre")
  @Column(name = "genre", nullable = false)
  private String genre;

  @JsonProperty("runtime")
  @Column(name = "runtime", nullable = false)
  private int runtime;

  @JsonProperty("releaseDate")
  @Column(name = "ReleaseDate", nullable = false)
  private String releaseDate;

  @JsonProperty("director")
  @Column(name = "director", nullable = false)
  private String director;

  @JsonProperty("cast")
  @Column(name = "MovieCast", nullable = false)
  private String cast;

  @JsonProperty("price")
  @Column(name = "price", nullable = false)
  private double price;

  @OneToMany(targetEntity = Review.class, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Review> reviews;

  @OneToMany(targetEntity = Theater.class, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Theater> theaters;
}
