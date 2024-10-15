package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;

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

  @Autowired
  private ReviewRepo reviewRepo;

  private static final String ALGORITHM = System.getenv("ALGORITHM");
  private static final String SECRET_KEY = System.getenv("SECRET_KEY");
  private static final String INIT_VECTOR = System.getenv("INIT_VECTOR");

  public boolean authenticate(String email, String password) {
    User user = userRepo.findByEmail(email);
    if (user == null) {
      return false;
    }
    return user.getPassword().equals(encrypt(password));
  }

  public boolean isAdmin(String email) {
    User user = userRepo.findByEmail(email);
    if (user == null) {
      return false;
    }
    return user.isAdmin();
  }

  public ResponseEntity<String> addUser(User newUser) {
    try {
      newUser.setPassword(encrypt(newUser.getPassword()));
      newUser.setCardNumber(encrypt(newUser.getCardNumber()));
      userRepo.save(newUser);
      return ResponseEntity.ok("User added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(newUser.toString());
    }
  }

  public Iterable<UserDto> getAllUsers() {
    return Mapper.mapToUList(userRepo.findAll());
  }

  public ResponseEntity<String> purchaseTicket(
      int numberPurchased, Long movieId, Long theaterId, Long userId, String paymentType
  ) {
    if (movieId == null || theaterId == null || userId == null) {
      return ResponseEntity.badRequest().body("Invalid movie, theater, or user ID");
    }

    Movie movie = movieRepo.findById(movieId).orElse(null);
    Theater theater = theaterRepo.findById(theaterId).orElse(null);
    User user = userRepo.findById(userId).orElse(null);

    if (movie == null || theater == null || user == null) {
      return ResponseEntity.badRequest().body("Invalid movie, theater, or user ID");
    }

    /* Option to only allow customers to purchase tickets if the movie is playing
    if (!movie.isPlaying())
      return ResponseEntity.badRequest().body("Movie is not playing");
    */

    if (paymentType.toLowerCase().contains("card")) {
      if (!validateCard(Objects.requireNonNull(decrypt(user.getCardNumber())))) {
        return ResponseEntity.badRequest().body("Invalid card number");
      }
    } else if (!paymentType.equalsIgnoreCase("paypal")) {
      return ResponseEntity.badRequest().body("Invalid payment type");
    }

    String location = theater.getLocation();
    String title = movie.getTitle();
    String email = user.getEmail();
    String uniqueId = location + title + email;

    Ticket ticketsExist = ticketRepo.findByUserIdAndMovieIdAndTheaterId(userId, movieId, theaterId);
    if (ticketsExist != null) {
      for (int i = ticketsExist.getTicketIds().size(); i < 10; i++) {
        ticketsExist.getTicketIds().add(generateRandId(uniqueId, i));
      }
      ticketsExist.setNumberPurchased(ticketsExist.getTicketIds().size());
      try {
        ticketRepo.save(ticketsExist);
        return ResponseEntity.ok("Maximum number of tickets (10) purchased");
      } catch (Exception e) {
        return ResponseEntity.badRequest().body("Failed to purchase tickets");
      }
    }

    Ticket ticket = new Ticket();
    ticket.setNumberPurchased(numberPurchased);
    ticket.setMovie(movie);
    ticket.setTheater(theater);
    ticket.setUser(user);
    ticket.setTicketIds(new ArrayList<>());

    for (int i = 0; i < numberPurchased; i++) {
      ticket.getTicketIds().add(generateRandId(uniqueId, i));
    }

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

  public ResponseEntity<String> updateUserCardNumber(String email, String newCardNumber) {
    return updateIndividualStat(email, "cardNumber", encrypt(newCardNumber));
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
      case "cardNumber" -> user.setCardNumber(newValue);
      default -> {
        return ResponseEntity.badRequest().body("Invalid field to update");
      }
    }
    userRepo.save(user);
    return ResponseEntity.ok(thingToUpdate + " updated successfully");
  }

  public ResponseEntity<String> viewTickets(Long userId, Long movieId) {
    Ticket ticket = ticketRepo.findByUserIdAndMovieId(userId, movieId);
    if (ticket == null) {
      return ResponseEntity.badRequest().body("No tickets found");
    }
    return ResponseEntity.ok(ticket.getTicketIds().toString());
  }

  public ResponseEntity<String> addReview(Long userId, Long movieId, String review) {
    User user = userRepo.findById(userId).orElse(null);
    Movie movie = movieRepo.findById(movieId).orElse(null);

    if (user == null || movie == null) {
      return ResponseEntity.badRequest().body("Invalid user or movie ID");
    }

    Review newReview = new Review();
    newReview.setReview(review);
    newReview.setUser(user);
    newReview.setMovie(movie);

    try {
      reviewRepo.save(newReview);
      return ResponseEntity.ok("Review added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to add review");
    }
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

  private String decrypt(String password) {
    try {
      IvParameterSpec iv = new IvParameterSpec(INIT_VECTOR.getBytes());
      SecretKeySpec secretKeySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");

      Cipher cipher = Cipher.getInstance(ALGORITHM);
      cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, iv);

      byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(password));
      return new String(decrypted);
    } catch (Exception ignored) {
    }
    return null;
  }

  private Long generateRandId(String header, int num) {
    header = header + num;
    int hash = header.hashCode();
    long time = System.currentTimeMillis();
    Random rand = new Random(hash + time);
    return Math.abs(rand.nextLong());
  }

  private boolean validateCard(String cardNum) {
    int len = cardNum.length();
    int sum = 0;
    boolean isSecond = false;

    for (int i = len - 1; i >= 0; i--) {
      int d = cardNum.charAt(i) - '0';
      if (isSecond)
        d = d * 2;
      sum += d / 10;
      sum += d % 10;
      isSecond = !isSecond;
    }

    return (sum % 10 == 0);
  }
}
