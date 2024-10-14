package CS_3365.MSB.Backend.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "UserId")
  private Long id;

  @JsonProperty("isAdmin")
  @Column(name = "is_admin", nullable = false)
  private boolean isAdmin;

  @JsonProperty("name")
  @Column(name = "name", nullable = false)
  private String name;

  @JsonProperty("email")
  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @JsonProperty("password")
  @Column(name = "password", nullable = false)
  private String password;

  @JsonProperty("phoneNum")
  @Column(name = "phone_number", nullable = false)
  private String phoneNumber;

  @JsonProperty("address")
  @Column(name = "address", nullable = false)
  private String address;

  @JsonProperty("cardNum")
  @Column(name = "card_number")
  private String cardNumber;
}
