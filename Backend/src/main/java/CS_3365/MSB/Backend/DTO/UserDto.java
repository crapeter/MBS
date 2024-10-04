package CS_3365.MSB.Backend.DTO;

import lombok.Data;

@Data
public class UserDto {
  private String name;
  private String email;
  private String phoneNumber;
  private String address;
  private boolean isAdmin;
}
