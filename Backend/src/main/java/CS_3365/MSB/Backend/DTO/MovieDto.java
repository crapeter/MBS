package CS_3365.MSB.Backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {
  @JsonProperty("title")
  private String title;

  @JsonProperty("description")
  private String description;

  @JsonProperty("genre")
  private String genre;

  @JsonProperty("runTime")
  private String runTime;

  @JsonProperty("showTime")
  private String showTime;

  @JsonProperty("releaseDate")
  private String releaseDate;

  @JsonProperty("director")
  private String director;

  @JsonProperty("cast")
  private String cast;

  @JsonProperty("price")
  private double price;

  @JsonProperty("isPlaying")
  private boolean isPlaying;
}
