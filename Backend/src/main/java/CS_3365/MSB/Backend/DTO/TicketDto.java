package CS_3365.MSB.Backend.DTO;

import lombok.Data;

@Data
public class TicketDto {
  private Long movieId;
  private Long theaterId;
  private String movieTitle;
  private String location;
  private String time;
  private int numberPurchased;
  private int roomNumber;
}
