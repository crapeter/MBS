package CS_3365.MSB.Backend.Models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@Table(name = "theaters")
public class Theater {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "TheaterId")
  private Long id;

  @Column(name = "movieId", nullable = false)
  private List<Long> movieId;

  @Column(name = "times", nullable = false)
  private List<LocalTime> times;

  @OneToMany(mappedBy = "theater", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Ticket> tickets;

  private String location;
  private int roomNumber;
  private int seatsBooked;
}
