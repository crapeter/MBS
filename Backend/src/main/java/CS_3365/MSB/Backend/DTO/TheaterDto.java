package CS_3365.MSB.Backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TheaterDto {
  private String location;
  private int roomNumber;
  private int seatsBooked;
}
