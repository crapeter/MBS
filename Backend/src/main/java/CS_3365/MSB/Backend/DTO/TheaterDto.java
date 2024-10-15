package CS_3365.MSB.Backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TheaterDto {
  @JsonProperty("location")
  private String location;

  @JsonProperty("roomNumber")
  private int roomNumber;

  @JsonProperty("seatsBooked")
  private int seatsBooked;

  @JsonProperty("movieId")
  private Long movieId;
}
