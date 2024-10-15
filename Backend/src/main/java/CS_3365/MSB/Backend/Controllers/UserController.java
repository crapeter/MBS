package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
  @Autowired
  private UserService userService;

  @PostMapping("/new/user")
  public ResponseEntity<String> newUser(@RequestBody User newUser) {
    return userService.addUser(newUser);
  }

  @PostMapping("/login")
  public boolean login(@RequestParam String email, @RequestParam String password) {
    return userService.authenticate(email, password);
  }

  @PostMapping("/purchase/tickets")
  public ResponseEntity<String> purchaseTicket(
      @RequestParam int numberPurchased,
      @RequestParam Long movieId,
      @RequestParam Long theaterId,
      @RequestParam Long userId,
      @RequestParam String paymentType
  ) {
    if (numberPurchased <= 0 || numberPurchased > 10) {
      return ResponseEntity.badRequest().body("Invalid number of tickets");
    }
    if (movieId == null || theaterId == null || userId == null) {
      return ResponseEntity.badRequest().body("Invalid movie, theater, or user ID");
    }
    return userService.purchaseTicket(numberPurchased, movieId, theaterId, userId, paymentType);
  }

  @GetMapping("/all")
  public Iterable<UserDto> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/tickets")
  public ResponseEntity<String> viewTickets(@RequestParam Long userId, @RequestParam Long movieId) {
    return userService.viewTickets(userId, movieId);
  }

  @GetMapping("/email")
  public UserDto getUserById(@RequestParam String email) {
    return Mapper.mapToDto(userService.getUserByEmail(email));
  }

  @PatchMapping("/update/name")
  public ResponseEntity<String> updateUserName(@RequestParam String email, @RequestParam String newName) {
    return userService.updateUserName(email, newName);
  }

  @PatchMapping("/update/email")
  public ResponseEntity<String> updateUserEmail(@RequestParam String email, @RequestParam String newEmail) {
    return userService.updateUserEmail(email, newEmail);
  }

  @PatchMapping("/update/password")
  public ResponseEntity<String> updateUserPassword(@RequestParam String email, @RequestParam String newPassword) {
    return userService.updateUserPassword(email, newPassword);
  }

  @PatchMapping("/update/phone")
  public ResponseEntity<String> updateUserPhoneNumber(@RequestParam String email, @RequestParam String newPhoneNumber) {
    return userService.updateUserPhoneNumber(email, newPhoneNumber);
  }

  @PatchMapping("/update/address")
  public ResponseEntity<String> updateUserAddress(@RequestParam String email, @RequestParam String newAddress) {
    return userService.updateUserAddress(email, newAddress);
  }

  @PatchMapping("/update/card")
  public ResponseEntity<String> updateUserCardNum(@RequestParam String email, @RequestParam String newCardNum) {
    return userService.updateUserCardNumber(email, newCardNum);
  }

  @PatchMapping("/add/review")
  public ResponseEntity<String> addReview(
      @RequestParam Long userId, @RequestParam Long movieId, @RequestParam String review
  ) {
    return userService.addReview(userId, movieId, review);
  }

  @DeleteMapping("/delete/{email}")
  public ResponseEntity<String> deleteUser(@PathVariable String email) {
    return userService.deleteUser(email);
  }
}
