package CS_3365.MSB.Backend.Models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "theaters")
public class Theater {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "TheaterId")
  private Long id;

  @Column(name = "movieId")
  private Long movieId;

  @OneToMany(mappedBy = "theater", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Ticket> tickets;

  private String location;
  private int roomNumber;
  private int seatsBooked;
}
