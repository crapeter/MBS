package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.UserDto;
import CS_3365.MSB.Backend.Models.User;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class UserService {
  @Autowired
  private UserRepo userRepository;

  private static final String ALGORITHM = System.getenv("ALGORITHM");
  private static final String SECRET_KEY = System.getenv("SECRET_KEY");
  private static final String INIT_VECTOR = System.getenv("INIT_VECTOR");

  public boolean authenticate(String email, String password) {
    return userRepository.findByEmail(email).getPassword().equals(encrypt(password));
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
    return null;  }

  public ResponseEntity<String> addUser(User newUser) {
    try {
      newUser.setPassword(encrypt(newUser.getPassword()));
      userRepository.save(newUser);
      return ResponseEntity.ok("User added successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to add user");
    }
  }

  public Iterable<UserDto> getAllUsers() {
    return Mapper.mapToDto(userRepository.findAll());
  }
}
