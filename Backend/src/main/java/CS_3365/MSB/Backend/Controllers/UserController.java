package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.UserDto;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Services.UserService;
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

  @PostMapping("/login/{email}/{password}")
  public boolean login(String email, String password) {
    return userService.authenticate(email, password);
  }

  @GetMapping("/all")
  public Iterable<UserDto> getAllUsers() {
    return userService.getAllUsers();
  }
}
