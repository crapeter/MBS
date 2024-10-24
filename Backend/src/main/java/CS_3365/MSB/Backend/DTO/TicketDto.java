package CS_3365.MSB.Backend.DTO;

import lombok.Data;

@Data
public class TicketDto {
  private MovieDto movie;
  private TheaterDto theater;
  private int numberPurchased;
  private int roomNumber;
}
