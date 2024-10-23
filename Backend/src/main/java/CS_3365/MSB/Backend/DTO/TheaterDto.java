package CS_3365.MSB.Backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class TheaterDto {
  @JsonProperty("id")
  private Long id;

  @JsonProperty("location")
  private String location;

  @JsonProperty("roomNumber")
  private int roomNumber;

  @JsonProperty("seatsBooked")
  private int seatsBooked;

  @JsonProperty("movieIds")
  private List<Long> movieIds;
}
