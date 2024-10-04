package CS_3365.MSB.Backend.DTO;

import lombok.Data;

import java.util.List;

@Data
public class MovieDto {
  private String title;
  private String description;
  private String genre;
  private String runtime;
  private String releaseDate;
  private String director;
  private String cast;
  private double price;
  private List<ReviewDto> reviews;
  private List<TheaterDto> theaters;
}
