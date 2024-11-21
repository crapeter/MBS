package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.DTO.TicketDto;
import CS_3365.MSB.Backend.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
public class TicketController {
  @Autowired
  private TicketService ticketService;

  @GetMapping("/all")
  public ResponseEntity<String> getTotalNumberOfTickets() {
    return ticketService.getTotalNumberOfTickets();
  }

  @GetMapping("/list")
  public List<Integer> numberSold() {
    return ticketService.numberSold();
  }

  @GetMapping("/location/total")
  public ResponseEntity<Integer> getUniqueTickets(@RequestParam String location) {
    return ticketService.getUniqueTickets(location);
  }

  @GetMapping("/location")
  public List<TicketDto> getTicketsByLocation(@RequestParam String location) {
    return ticketService.getTicketsByLocation(location);
  }

  @GetMapping("/number/sold")
  public ResponseEntity<Integer> getNumberSold() {
    return ticketService.getNumberSold();
  }

  @GetMapping("/number/sold/{location}")
  public ResponseEntity<Integer> getNumberSoldByLocation(@PathVariable String location) {
    return ticketService.getNumberSoldByLocation(location);
  }

  @GetMapping("/theater/breakdown/{location}")
  public List<TicketDto> getTheaterBreakdown(@PathVariable String location) {
    return ticketService.getTheaterBreakdown(location);
  }
}
