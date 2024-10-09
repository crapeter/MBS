package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.UserDto;
import CS_3365.MSB.Backend.Models.Ticket;
import CS_3365.MSB.Backend.Models.User;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.List;

@Service
public class UserService {
  @Autowired
  private UserRepo userRepo;

  @Autowired
  private TicketRepo ticketRepo;

  @Autowired
  private MovieRepo movieRepo;

  @Autowired
  private TheaterRepo theaterRepo;

  private static final String ALGORITHM = System.getenv("ALGORITHM");
  private static final String SECRET_KEY = System.getenv("SECRET_KEY");
  private static final String INIT_VECTOR = System.getenv("INIT_VECTOR");

  public boolean authenticate(String email, String password) {
    return userRepo.findByEmail(email).getPassword().equals(encrypt(password));
  }

  private String encrypt(String password) {
    try {
      IvParameterSpec iv = new IvParameterSpec(INIT_VECTOR.getBytes());
      SecretKeySpec secretKeySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");

      Cipher cipher = Cipher.getInstance(ALGORITHM);
      cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, iv);

      byte[] encrypted = cipher.doFinal(password.getBytes());
      return Base64.getEncoder().encodeToString(encrypted);
    } catch (Exception ignored) {
    }
    return null;
  }

  public ResponseEntity<String> addUser(User newUser) {
    try {
      newUser.setPassword(encrypt(newUser.getPassword()));
      userRepo.save(newUser);
      return ResponseEntity.ok("User added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to add user");
    }
  }

  public Iterable<UserDto> getAllUsers() {
    return Mapper.mapToUList(userRepo.findAll());
  }

  public ResponseEntity<String> purchaseTicket(int numberPurchased, Long movieId, Long theaterId, Long userId) {
    if (movieId == null || theaterId == null || userId == null) {
      return ResponseEntity.badRequest().body("Invalid movie, theater, or user ID");
    }

    Ticket ticket = new Ticket();
    ticket.setNumberPurchased(numberPurchased);
    ticket.setMovie(movieRepo.findById(movieId).orElse(null));
    ticket.setTheater(theaterRepo.findById(theaterId).orElse(null));
    ticket.setUser(userRepo.findById(userId).orElse(null));

    try {
      ticketRepo.save(ticket);
      return ResponseEntity.ok("Ticket purchased successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to purchase ticket");
    }
  }

  public User getUserByEmail(String email) {
    return userRepo.findByEmail(email);
  }

  public ResponseEntity<String> deleteUser(String email) {
    try {
      userRepo.delete(userRepo.findByEmail(email));
      return ResponseEntity.ok("User deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to delete user");
    }
  }

  public ResponseEntity<String> updateUserEmail(String email, String newEmail) {
    return updateIndividualStat(email, "email", newEmail);
  }

  public ResponseEntity<String> updateUserAddress(String email, String newAddress) {
    return updateIndividualStat(email, "address", newAddress);
  }

  public ResponseEntity<String> updateUserPhoneNumber(String email, String newPhoneNumber) {
    return updateIndividualStat(email, "phoneNumber", newPhoneNumber);
  }

  public ResponseEntity<String> updateUserName(String email, String newName) {
    return updateIndividualStat(email, "name", newName);
  }

  public ResponseEntity<String> updateUserPassword(String email, String newPassword) {
    return updateIndividualStat(email, "password", encrypt(newPassword));
  }

  private ResponseEntity<String> updateIndividualStat(String email, String thingToUpdate, String newValue) {
    User user = userRepo.findByEmail(email);
    if (user == null) {
      return ResponseEntity.badRequest().body("User not found");
    }
    switch (thingToUpdate) {
      case "name" -> user.setName(newValue);
      case "email" -> user.setEmail(newValue);
      case "address" -> user.setAddress(newValue);
      case "password" -> user.setPassword(newValue);
      case "phoneNumber" -> user.setPhoneNumber(newValue);
      default -> {
        return ResponseEntity.badRequest().body("Invalid field to update");
      }
    }
    userRepo.save(user);
    return ResponseEntity.ok(thingToUpdate + " updated successfully");
  }

  public Iterable<String> viewTickets(Long userId, Long movieId) {
    List<Ticket> tickets = ticketRepo.findByUserId(userId);
    return tickets
        .stream()
        .filter(ticket -> ticket.getMovie().getId().equals(movieId))
        .map(ticket -> ticket.getId().toString())
        .toList();
  }
}
